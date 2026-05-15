import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as admin from 'firebase-admin';
import emailjs from '@emailjs/nodejs';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const messaging = admin.messaging();

// ----------------------------------------------------------------------
// TRIGGER 1: New Application Submitted -> Notify Admin (In-App + Email)
// ----------------------------------------------------------------------
export const onVerificationRequested = onDocumentCreated("verification_requests/{uid}", async (event) => {
    const data = event.data?.data();
    if (!data) return;
    
    const uid = event.params.uid;
    const professionalName = data.professionalName || data.legalName || 'Un nouveau thérapeute';
    
    // 1. Save to Admin's In-App Inbox
    await db.collection('notifications').add({
      recipientId: 'super_admin',
      type: 'kyc_submitted',
      title: 'Nouvelle demande KYC',
      body: `${professionalName} a soumis une demande de certification.`,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        therapistId: uid
      }
    });

    // 2. Fire the EmailJS Notification
    try {
      const templateParams = {
        admin_email: 'yvan@massagenow.ca',
        therapist_name: professionalName,
        user_uid: uid,
        submission_time: new Date().toLocaleString('fr-FR'),
        dashboard_link: `https://admin.massagenow.ca/dashboard/kyc` 
      };

      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_TEMPLATE_ID!,
        templateParams,
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY!,
          privateKey: process.env.EMAILJS_PRIVATE_KEY!,
        }
      );
    } catch (error) {
      console.error('[EMAIL] EmailJS failed:', error);
    }
});


// ----------------------------------------------------------------------
// TRIGGER 2: Application Reviewed -> Notify Therapist (In-App + Push)
// ----------------------------------------------------------------------
export const onVerificationReviewed = onDocumentUpdated("verification_requests/{uid}", async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;

    const uid = event.params.uid;

    if (before.status === after.status) return;

    let title = '';
    let body = '';
    let type: 'kyc_approved' | 'kyc_rejected' = 'kyc_approved';

    if (after.status === 'approved') {
      title = 'Félicitations ! 🎉';
      body = 'Votre profil thérapeute a été approuvé.';
      type = 'kyc_approved';
    } else if (after.status === 'rejected' || after.status === 'resubmit') {
      title = 'Mise à jour de votre demande';
      body = after.rejectionReason || 'Nous avons besoin de plus d\'informations.';
      type = 'kyc_rejected';
    } else {
      return;
    }

    await db.collection('notifications').add({
      recipientId: uid,
      type: type,
      title: title,
      body: body,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const userDoc = await db.collection('users').doc(uid).get();
    const fcmTokens = userDoc.data()?.fcmTokens || [];

    if (fcmTokens.length > 0) {
      const message = {
        notification: { title, body },
        data: {
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          route: '/therapist/dashboard',
          type: type
        },
        tokens: fcmTokens,
      };
      try {
        await messaging.sendEachForMulticast(message);
      } catch (error) {
        console.error(`[NOTIF] FCM failed for ${uid}:`, error);
      }
    }
});
