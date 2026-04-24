import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const messaging = admin.messaging();

// ----------------------------------------------------------------------
// TRIGGER 1: New Application Submitted -> Notify Admin
// ----------------------------------------------------------------------
export const onVerificationRequested = functions.firestore
  .document('verification_requests/{uid}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    // 1. Save to Admin's In-App Inbox
    await db.collection('notifications').add({
      recipientId: 'super_admin',
      type: 'kyc_submitted',
      title: 'Nouvelle demande KYC',
      body: `${data.professionalName || 'Un nouveau thérapeute'} a soumis une demande de certification.`,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        therapistId: context.params.uid
      }
    });

    console.log(`[NOTIF] Application notification created for Super Admin (User: ${context.params.uid})`);
  });


// ----------------------------------------------------------------------
// TRIGGER 2: Application Reviewed -> Notify Therapist
// ----------------------------------------------------------------------
export const onVerificationReviewed = functions.firestore
  .document('verification_requests/{uid}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const uid = context.params.uid;

    // Only proceed if the status actually changed
    if (before.status === after.status) return;

    let title = '';
    let body = '';
    let type: 'kyc_approved' | 'kyc_rejected' = 'kyc_approved';

    if (after.status === 'approved') {
      title = 'Félicitations ! 🎉';
      body = 'Votre profil thérapeute a été approuvé. Vous pouvez maintenant configurer vos services.';
      type = 'kyc_approved';
    } else if (after.status === 'rejected' || after.status === 'resubmit') {
      title = 'Mise à jour de votre demande';
      body = after.rejectionReason || 'Malheureusement, nous avons besoin de plus d\'informations. Veuillez vérifier vos documents.';
      type = 'kyc_rejected';
    } else {
      return; // Do nothing for other status changes
    }

    // 1. Save to Therapist's In-App Inbox
    await db.collection('notifications').add({
      recipientId: uid,
      type: type,
      title: title,
      body: body,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Send Mobile Push Notification (FCM)
    const userDoc = await db.collection('users').doc(uid).get();
    const fcmTokens = userDoc.data()?.fcmTokens || [];

    if (fcmTokens.length > 0) {
      const payload = {
        notification: {
          title: title,
          body: body,
        },
        data: {
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          route: '/therapist/dashboard',
          type: type
        }
      };

      try {
        const response = await messaging.sendToDevice(fcmTokens, payload);
        console.log(`[NOTIF] FCM sent to ${uid}: ${response.successCount} success, ${response.failureCount} failure`);
      } catch (error) {
        console.error(`[NOTIF] FCM failed for ${uid}:`, error);
      }
    }
  });
