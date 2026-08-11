// ----------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------
const salonWhatsAppNumber = "7408668784";


// ----------------------------------------------------
// SERVICE PRICES
// ----------------------------------------------------
const servicePrices = {
    "Haircut": 50,
    "Beard Grooming": 40,
    "D-Tan Treatment": 200,
    "Bleach": 120,
    "Ayurvedic Massage": 150,
    "Scrub Treatment": 60,
    "Facial": 500,
    "Special Facial": 1500,
    "Other Services": 0
};


// ----------------------------------------------------
// DATE FORMATTER
// Automatically adds "/" while typing
// ----------------------------------------------------
const dateInput = document.getElementById("custDate");

if (dateInput) {

    dateInput.addEventListener("input", function (e) {

        let value = e.target.value.replace(/\D/g, "");

        if (value.length > 2 && value.length <= 4) {

            value =
                value.slice(0, 2) +
                "/" +
                value.slice(2);

        } else if (value.length > 4) {

            value =
                value.slice(0, 2) +
                "/" +
                value.slice(2, 4) +
                "/" +
                value.slice(4, 8);
        }

        e.target.value = value;

    });

}


// ----------------------------------------------------
// BOOKING FORM
// ----------------------------------------------------
document.getElementById("bookingForm").addEventListener("submit", function (e) {

    e.preventDefault();


    // Customer Details
    const name =
        document.getElementById("custName").value.trim();

    const phone =
        document.getElementById("custPhone").value.trim();

    const dateInput =
        document.getElementById("custDate").value.trim();

    const time =
        document.getElementById("custTime").value;


    // ------------------------------------------------
    // GET MULTIPLE SELECTED SERVICES
    // ------------------------------------------------
    const selectedServices = Array.from(
        document.querySelectorAll('input[name="services"]:checked')
    ).map(service => service.value);


    // ------------------------------------------------
    // CHECK SERVICE SELECTION
    // ------------------------------------------------
    if (selectedServices.length === 0) {

        alert("Please select at least one service.");

        return;
    }


    // ------------------------------------------------
    // FORMAT DATE
    // ------------------------------------------------
    let formattedDate = dateInput || "Not specified";

    let dayName = "";

    if (dateInput && dateInput.includes("/")) {

        const [day, month, year] =
            dateInput.split("/");

        if (
            day &&
            month &&
            year &&
            year.length === 4
        ) {

            const dateObj =
                new Date(
                    year,
                    month - 1,
                    day
                );

            dayName =
                dateObj.toLocaleDateString(
                    "en-IN",
                    {
                        weekday: "long"
                    }
                );
        }
    }


    const fullDateString =
        dayName
            ? `${formattedDate} (${dayName})`
            : formattedDate;


    // ------------------------------------------------
    // FORMAT SERVICES
    // ------------------------------------------------
    const servicesMessage =
        selectedServices
            .map((service, index) => {

                return `${index + 1}. ${service}`;

            })
            .join("\n");


    // ------------------------------------------------
    // WHATSAPP MESSAGE
    // ------------------------------------------------
    const message =
`💈 *NEW SUPER SALOON & MEN'S PARLOUR* 💈

*APPOINTMENT REQUEST*

Namaste! I would like to book an appointment.

👤 *Customer Name:*
${name}

📱 *Phone Number:*
${phone}

💇 *Selected Services:*
${servicesMessage}

📅 *Preferred Date:*
${fullDateString}

⏰ *Preferred Time:*
${time}

📌 *Payment:*
Payment will be made at the salon.

Please confirm my appointment.

Thank you! 🙏`;


    // ------------------------------------------------
    // OPEN WHATSAPP
    // ------------------------------------------------
    const encodedMessage =
        encodeURIComponent(message);

    const whatsappURL =
        `https://wa.me/${salonWhatsAppNumber}?text=${encodedMessage}`;

    window.open(
        whatsappURL,
        "_blank"
    );

});