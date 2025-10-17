/**
 * Generate VAPID Keys for Web Push Notifications
 * Run this once and add keys to .env.local
 */

const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('\n🔑 VAPID Keys Generated!\n');
console.log('Add these to your .env.local file:\n');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log('\n⚠️  Keep the private key secret! Never commit it to git.\n');
