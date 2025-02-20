function printdDoc() {
    $("#reportContent").printThis({
        importCSS: true,   // Import CSS from the page
        importStyle: true, // Ensure inline styles are included
        printContainer: true // Print the content inside #reportContent
    });
}

function pdfDoc() {
    let { jsPDF } = window.jspdf; // ✅ Access jsPDF from window.jspdf

    let element = document.getElementById('reportContent'); // ID of the report section

    html2canvas(element, { scale: 2 }).then(canvas => {
        let imgData = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, A4 size

        let pageWidth = pdf.internal.pageSize.getWidth();
        let pageHeight = pdf.internal.pageSize.getHeight();

        let imgWidth = pageWidth - 20; // 10mm margin on both sides
        let imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

        let yPosition = 10; // Start position
        let pageCanvasHeight = (canvas.width * pageHeight) / pageWidth; // Height of A4 page in canvas terms

        let currentPosition = 0; // Track how much of the image is added to PDF

        while (currentPosition < canvas.height) {
            let canvasPart = document.createElement('canvas');
            canvasPart.width = canvas.width;
            canvasPart.height = Math.min(pageCanvasHeight, canvas.height - currentPosition);

            let ctx = canvasPart.getContext('2d');
            ctx.drawImage(canvas, 0, currentPosition, canvas.width, canvasPart.height, 0, 0, canvas.width, canvasPart.height);

            let imgPart = canvasPart.toDataURL('image/png');
            if (currentPosition > 0) pdf.addPage();
            pdf.addImage(imgPart, 'PNG', 10, yPosition, imgWidth, (canvasPart.height * imgWidth) / canvas.width);

            currentPosition += pageCanvasHeight;
        }

        pdf.save("FinOps_Report.pdf");
    });
}

function emailDoc() {
    $("#emailModal").toggle();
}


Highcharts.chart('costDistribution', {
    chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    subtitle: {
        text:
            ' ' +
            ''
    },
    xAxis: {
        categories: ['USA', 'China', 'Brazil', 'EU', 'Argentina', 'India'],
        crosshair: true,
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '1000 metric tons (MT)'
        }
    },
    tooltip: {
        valueSuffix: ' (1000 MT)'
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [
        {
            name: 'Corn',
            data: [387749, 280000, 129000, 64300, 54000, 34300]
        },
        {
            name: 'Wheat',
            data: [45321, 140000, 10000, 140500, 19500, 113500]
        }
    ]
});