// ----------------------------------------------------
// CONFIGURATION: अपनी UPI ID और WhatsApp नंबर यहाँ बदलें
// ----------------------------------------------------
const salonWhatsAppNumber = "919795334608"; 
const upiId = "q132551802@ybl"; 
const payeeName = "THE BARBER STUDIO";

// एडवांस भुगतान का प्रतिशत (10%)
const ADVANCE_PERCENTAGE = 0.20;

const servicePrices = {
    "Executive Haircut": 350,
    "Hot Towel Shave": 250,
    "Beard Styling": 200,
    "Charcoal Cleanup": 650,
    "Ayurvedic Spa": 500,
    "Royal Package": 2499
};

// UPI Display अपडेट करें
document.getElementById('displayUpiId').innerText = upiId;

// UPI URL और QR Code अपडेट करने का फ़ंक्शन
function updateUpiPaymentDetails() {
    const service = document.getElementById('custService').value;
    const totalAmount = servicePrices[service] || 0;
    
    // 20% Advance Amount की गणना (Round Figure में)
    const advanceAmount = Math.round(totalAmount * ADVANCE_PERCENTAGE);
    const remainingAmount = totalAmount - advanceAmount;
    
    // UI में Total और Advance Display अपडेट करना
    document.getElementById('payableAmountDisplay').innerText = `₹${advanceAmount} (10% advance of ₹${totalAmount})`;

    // UPI Intent URL तैयार करना (अब सिर्फ Advance Amount जाएगा)
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${advanceAmount}&cu=INR&tn=${encodeURIComponent('Salon Slot Booking Advance')}`;
    
    // Direct UPI Link बटन अपडेट करना
    document.getElementById('directUpiBtn').href = upiUrl;

    // QR Code API से QR अपडेट करना
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
    document.getElementById('upiQrCode').src = qrApiUrl;
}

// सर्विस बदलने पर UPI QR कोड बदलें
document.getElementById('custService').addEventListener('change', updateUpiPaymentDetails);

// पेज लोड पर डिफ़ॉल्ट QR कोड जनरेट करें
updateUpiPaymentDetails();

// टाइप करते समय अपने आप '/' (Slash) जोड़ने का फ़ंक्शन
document.getElementById('custDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 2 && value.length <= 4) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    } else if (value.length > 4) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
    }
    e.target.value = value;
});

// फॉर्म सबमिट और व्हाट्सएप मैसेज भेजना
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const service = document.getElementById('custService').value;
    const dateInput = document.getElementById('custDate').value.trim(); 
    const time = document.getElementById('custTime').value;
    const txnId = document.getElementById('txnId').value.trim();

    const totalAmount = servicePrices[service] || 0;
    const advanceAmount = Math.round(totalAmount * ADVANCE_PERCENTAGE);
    const remainingAmount = totalAmount - advanceAmount;

    let formattedDate = dateInput || 'Not specified';
    let dayName = '';

    if (dateInput && dateInput.includes('/')) {
        const [day, month, year] = dateInput.split('/');
        if (day && month && year && year.length === 4) {
            const dateObj = new Date(year, month - 1, day);
            const dayOptions = { weekday: 'long' };
            dayName = dateObj.toLocaleDateString('hi-IN', dayOptions);
        }
    }

    const fullDateString = dayName ? `${formattedDate} (${dayName})` : formattedDate;
    const paymentStatusMsg = txnId ? `✅ Advance ₹${advanceAmount} Paid (UTR ID: ${txnId})` : `⏳ Advance Pending (UPI / Counter)`;

    const message = 
`💈 *THE BARBER STUDIO - APPOINTMENT & PAYMENT REQUEST* 💈
----------------------------------------
नमस्कार, मैंने अपॉइंटमेंट बुक किया है। विवरण नीचे दिया गया है:

👤 *ग्राहक का नाम:* ${name}
📞 *मोबाइल नंबर:* ${phone}
✂️ *चुनी गई सेवा:* ${service}
💵 *कुल शुल्क:* ₹${totalAmount}
💳 *20% Advance:* ₹${advanceAmount}
🏷️ *बाकी (Balance Amount):* ₹${remainingAmount}
📅 *दिनांक व दिन:* ${fullDateString}
⏰ *समय Slot:* ${time}
📊 *पेमेंट स्थिति:* ${paymentStatusMsg}
🏦 *UPI ID:* ${upiId}
----------------------------------------
कृपया इस बुकिंग और एडवांस पेमेंट की पुष्टि (Confirm) करें। धन्यवाद!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${salonWhatsAppNumber}?text=${encodedMessage}`, '_blank');
});
