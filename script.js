const API_URL =
"https://opensheet.elk.sh/1C2xRxuiutx9LT6RYc43zuLosM9IkE6zdjVvnepvBImU/Sheet1";

async function searchTracking() {

    const tracking = document
        .getElementById("tracking")
        .value
        .trim()
        .toUpperCase();

    const result =
        document.getElementById("result");

    if (!tracking) {

        result.innerHTML = `
            <div class="not-found">
                <h2>Ingrese un número de seguimiento</h2>
            </div>
        `;

        return;
    }

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        const packageFound = data.find(item => {

            const firstColumn = Object.values(item)[0];

            if (!firstColumn) return false;

            return String(firstColumn)
                .trim()
                .toUpperCase() === tracking;
        });

        if (!packageFound) {

            result.innerHTML = `
                <div class="not-found">
                    <h2>❌ Número no encontrado</h2>
                    <p>${tracking}</p>
                </div>
            `;

            return;
        }

        let usaClass = "pending";
        let transitClass = "pending";
        let deliveryClass = "pending";

        let line1 = "pending";
        let line2 = "pending";

        const status = String(
            packageFound["Estado"] || ""
        ).trim().toLowerCase();

        if (status === "en miami") {

            usaClass = "active";

        } else if (status === "en camino") {

            usaClass = "active";
            transitClass = "active";
            line1 = "active";

        } else if (status === "entregado") {

            usaClass = "active";
            transitClass = "active";
            deliveryClass = "active";

            line1 = "active";
            line2 = "active";
        }

        result.innerHTML = `
            <div class="tracking-card">

                <h2>
                    📦 ${packageFound["Numero de seguimiento"] || ""}
                </h2>

                <div class="tracking-info">

                    <div class="info-item">
                        <h4>✈️ Salida de Miami</h4>
                        <p>${packageFound["Salida de Miami"] || ""}</p>
                    </div>

                    <div class="info-item">
                        <h4>🚚 Entrega aproximada</h4>
                        <p>${packageFound["Entrega aproximada"] || ""}</p>
                    </div>

                    <div class="info-item status">
                        <h4>📍 Estado</h4>
                        <p>${packageFound["Estado"] || ""}</p>
                    </div>

                </div>



                <h3 class="timeline-title">
                    Progreso del envío
                </h3>

                <div class="timeline">

                    <div class="step">
                        <div class="circle ${usaClass}">
                            ✓
                        </div>
                        <p>Miami</p>
                    </div>

                    <div class="line ${line1}"></div>

                    <div class="step">
                        <div class="circle ${transitClass}">
                            ✈
                        </div>
                        <p>En camino</p>
                    </div>

                    <div class="line ${line2}"></div>

                    <div class="step">
                        <div class="circle ${deliveryClass}">
                            📦
                        </div>
                        <p>Entregado</p>
                    </div>

                </div>

            </div>
        `;

    }
    catch (error) {

        console.error(error);

        result.innerHTML = `
            <div class="not-found">
                <h2>Error consultando la base de datos</h2>
            </div>
        `;
    }
}