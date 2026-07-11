from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def create_report(filename, prediction, confidence):

    pdf_name = f"{filename}_report.pdf"

    doc = SimpleDocTemplate(pdf_name)

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph(
            "Deepfake Audio Detection Report",
            styles['Title']
        )
    )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            f"File Name: {filename}",
            styles['Normal']
        )
    )

    content.append(
        Paragraph(
            f"Prediction: {prediction}",
            styles['Normal']
        )
    )

    content.append(
        Paragraph(
            f"Confidence: {confidence}%",
            styles['Normal']
        )
    )

    doc.build(content)

    return pdf_name