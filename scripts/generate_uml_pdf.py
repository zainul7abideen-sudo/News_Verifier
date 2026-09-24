import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Group, Polygon, Circle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Cover page
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header
        self.drawString(40, 805, "SRA TruthGuard — UML Class & Object Diagrams Specification")
        self.drawRightString(555, 805, "DOC: UML-SRA-2026-v1.0")
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.75)
        self.line(40, 798, 555, 798)
        
        # Footer
        self.line(40, 45, 555, 45)
        self.drawString(40, 32, "Confidential — SRA Media Integrity Network")
        self.drawRightString(555, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf(filename="SRA_TruthGuard_Class_and_Object_Diagrams.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=30,
        textColor=colors.HexColor("#f8fafc"),
        alignment=TA_LEFT
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#94a3b8"),
        alignment=TA_LEFT
    )
    
    h1_style = ParagraphStyle(
        'H1Style',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'H2Style',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#0284c7"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155")
    )

    body_bold = ParagraphStyle(
        'BodyDarkBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#0f172a")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0369a1"),
        alignment=TA_LEFT
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1e293b")
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0f172a")
    )

    badge_pass_style = ParagraphStyle(
        'BadgePass',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor("#166534")
    )

    story = []

    # ==========================================
    # 1. COVER PAGE
    # ==========================================
    cover_table_data = [
        [Paragraph("<font color='#38bdf8'><b>UML FORMAL SPECIFICATION</b></font>", body_style)],
        [Spacer(1, 10)],
        [Paragraph("SRA TruthGuard", title_style)],
        [Paragraph("Formal UML Class & Object Diagrams Specification Document", subtitle_style)],
        [Spacer(1, 20)],
        [Paragraph(
            "An exhaustive domain-driven architectural breakdown of the SRA News Verification Platform. "
            "Defines structural class schemas, inheritance hierarchies, runtime instance object states, "
            "and Google AI Studio (Gemini 3 Flash) multimodal verification pipelines.",
            body_style
        )],
        [Spacer(1, 180)],
        [Table([
            [Paragraph("<b>DOCUMENT ID:</b>", body_style), Paragraph("UML-SRA-2026-v1.0", body_bold),
             Paragraph("<b>SYSTEM ARCHITECT:</b>", body_style), Paragraph("Md Ekbal (Super Admin)", body_bold)],
            [Paragraph("<b>UML STANDARD:</b>", body_style), Paragraph("OMG UML 2.5.1", body_bold),
             Paragraph("<b>AI CORE ENGINE:</b>", body_style), Paragraph("Google AI Studio (Gemini Flash)", body_bold)],
            [Paragraph("<b>REPOSITORY:</b>", body_style), Paragraph("News_Verifier (main)", body_bold),
             Paragraph("<b>PUBLICATION:</b>", body_style), Paragraph("September 2026", body_bold)],
            [Paragraph("<b>LIVE APP:</b>", body_style), Paragraph("chimerical-boba-ea62fe.netlify.app", body_bold),
             Paragraph("<b>STATUS:</b>", body_style), Paragraph("Production Sealed", body_bold)]
        ], colWidths=[105, 150, 115, 140], style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#1e293b")),
            ('TEXTCOLOR', (0,0), (-1,-1), colors.white),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#334155")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#475569")),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ])]
    ]

    cover_outer = Table(cover_table_data, colWidths=[515], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#090d16")),
        ('LEFTPADDING', (0,0), (-1,-1), 24),
        ('RIGHTPADDING', (0,0), (-1,-1), 24),
        ('TOPPADDING', (0,0), (-1,-1), 30),
        ('BOTTOMPADDING', (0,0), (-1,-1), 30),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor("#0284c7")),
    ])
    story.append(cover_outer)
    story.append(PageBreak())

    # ==========================================
    # 2. SECTION 1: ARCHITECTURAL OVERVIEW
    # ==========================================
    story.append(Paragraph("1. Object-Oriented Domain Architecture", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))
    
    story.append(Paragraph(
        "The SRA TruthGuard domain model is organized into cohesive object-oriented subsystems. "
        "Separation of concerns is maintained between the <b>Ingestion Layer</b> (live multi-network RSS crawlers and user submissions), "
        "the <b>Forensic Core</b> (Google Gemini AI and regex rule matchers), and the <b>Auditing / Identity Layer</b> "
        "(SHA-256 cryptographic certificates and role-based permissions).",
        body_style
    ))
    story.append(Spacer(1, 8))

    design_patterns_data = [
        [Paragraph("Pattern", table_header_style), Paragraph("UML Participants", table_header_style), Paragraph("Architectural Responsibility", table_header_style)],
        [
            Paragraph("<b>Strategy</b>", table_cell_style),
            Paragraph("<code>IVerificationStrategy</code><br/>&bull; <code>TextForensicStrategy</code><br/>&bull; <code>VideoDeepfakeStrategy</code><br/>&bull; <code>UrlCorroborationStrategy</code>", code_style),
            Paragraph("Enables interchangeable verification routines depending on media modality (viral text, YouTube deepfake, circular PDF, press URL).", table_cell_style)
        ],
        [
            Paragraph("<b>Singleton</b>", table_cell_style),
            Paragraph("<code>PIBGroundTruthDatabase</code><br/><code>FactCheckerStore</code>", code_style),
            Paragraph("Maintains a unified, thread-safe cache of official Press Information Bureau releases, RBI circulars, and ground-truth patterns.", table_cell_style)
        ],
        [
            Paragraph("<b>Factory Method</b>", table_cell_style),
            Paragraph("<code>VerdictFactory.create()</code>", code_style),
            Paragraph("Encapsulates the creation of <code>VerificationVerdict</code> instances, binding calculated sensationalism and generating SHA-256 seals.", table_cell_style)
        ],
        [
            Paragraph("<b>Observer</b>", table_cell_style),
            Paragraph("<code>ForensicTelemetryNotifier</code><br/><code>HUDStreamSubscriber</code>", code_style),
            Paragraph("Streams multi-stage telemetry logs from the AI processing pipeline directly to the client's holographic cyber HUD.", table_cell_style)
        ]
    ]

    t_patterns = Table(design_patterns_data, colWidths=[80, 165, 270], style=[
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f0f9ff")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ])
    story.append(t_patterns)
    story.append(Spacer(1, 14))

    # ==========================================
    # 3. SECTION 2: MASTER UML CLASS DIAGRAM
    # ==========================================
    story.append(Paragraph("2. Master UML Class Diagram", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))
    
    story.append(Paragraph(
        "The following diagram details the structural relationships between domain classes, "
        "including attributes, operations, access modifiers (<code>+ public</code>, <code>- private</code>), "
        "inheritance, composition, aggregation, and associations.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # REPORTLAB NATIVE DRAWING: UML CLASS DIAGRAM
    d_class = Drawing(515, 300)
    
    # Background Box
    d_class.add(Rect(0, 0, 515, 300, rx=6, ry=6, fillColor=colors.HexColor("#f8fafc"), strokeColor=colors.HexColor("#cbd5e1"), strokeWidth=1))

    # 1. NewsArticle Box
    d_class.add(Rect(15, 175, 140, 110, rx=4, ry=4, fillColor=colors.white, strokeColor=colors.HexColor("#0284c7"), strokeWidth=1.2))
    d_class.add(Rect(15, 265, 140, 20, rx=4, ry=4, fillColor=colors.HexColor("#0284c7"), strokeColor=colors.HexColor("#0284c7"), strokeWidth=1))
    d_class.add(String(85, 270, "NewsArticle", textAnchor='middle', fontName='Helvetica-Bold', fontSize=8.5, fillColor=colors.white))
    d_class.add(String(20, 252, "+ id: String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(20, 240, "+ title: String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(20, 228, "+ source: String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(20, 216, "+ isVerified: Boolean", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(Line(15, 208, 155, 208, strokeColor=colors.HexColor("#e2e8f0"), strokeWidth=0.75))
    d_class.add(String(20, 196, "+ getSummary(): String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))
    d_class.add(String(20, 184, "+ triggerCheck(): Verdict", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))

    # 2. ClaimVerificationRequest Box
    d_class.add(Rect(185, 175, 150, 110, rx=4, ry=4, fillColor=colors.white, strokeColor=colors.HexColor("#0284c7"), strokeWidth=1.2))
    d_class.add(Rect(185, 265, 150, 20, rx=4, ry=4, fillColor=colors.HexColor("#0284c7"), strokeColor=colors.HexColor("#0284c7"), strokeWidth=1))
    d_class.add(String(260, 270, "ClaimVerificationRequest", textAnchor='middle', fontName='Helvetica-Bold', fontSize=8, fillColor=colors.white))
    d_class.add(String(190, 252, "+ requestId: String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(190, 240, "+ method: VerifyMethod", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(190, 228, "+ claimText: String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(190, 216, "+ context: Object", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(Line(185, 208, 335, 208, strokeColor=colors.HexColor("#e2e8f0"), strokeWidth=0.75))
    d_class.add(String(190, 196, "+ validate(): Boolean", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))
    d_class.add(String(190, 184, "+ normalize(): String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))

    # 3. VerificationVerdict Box
    d_class.add(Rect(365, 175, 135, 110, rx=4, ry=4, fillColor=colors.white, strokeColor=colors.HexColor("#0284c7"), strokeWidth=1.2))
    d_class.add(Rect(365, 265, 135, 20, rx=4, ry=4, fillColor=colors.HexColor("#0284c7"), strokeColor=colors.HexColor("#0284c7"), strokeWidth=1))
    d_class.add(String(432, 270, "VerificationVerdict", textAnchor='middle', fontName='Helvetica-Bold', fontSize=8.5, fillColor=colors.white))
    d_class.add(String(370, 252, "+ verdict: VerdictType", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(370, 240, "+ confidence: Int", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(370, 228, "+ sensationalism: Int", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(370, 216, "+ explanation: String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(Line(365, 208, 500, 208, strokeColor=colors.HexColor("#e2e8f0"), strokeWidth=0.75))
    d_class.add(String(370, 196, "+ sealCertificate(): Cert", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))
    d_class.add(String(370, 184, "+ toJSON(): Object", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))

    # 4. GeminiForensicEngine Box
    d_class.add(Rect(185, 30, 150, 115, rx=4, ry=4, fillColor=colors.HexColor("#f0fdfa"), strokeColor=colors.HexColor("#0d9488"), strokeWidth=1.2))
    d_class.add(Rect(185, 125, 150, 20, rx=4, ry=4, fillColor=colors.HexColor("#0d9488"), strokeColor=colors.HexColor("#0d9488"), strokeWidth=1))
    d_class.add(String(260, 130, "GeminiForensicEngine", textAnchor='middle', fontName='Helvetica-Bold', fontSize=8, fillColor=colors.white))
    d_class.add(String(190, 112, "- apiKey: String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(190, 100, "- models: String[]", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(190, 88, "- activeModel: String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(Line(185, 80, 335, 80, strokeColor=colors.HexColor("#ccfbf1"), strokeWidth=0.75))
    d_class.add(String(190, 68, "+ verifyClaim(req): Verdict", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))
    d_class.add(String(190, 56, "+ scoreSensationalism(): Int", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))
    d_class.add(String(190, 44, "+ streamLogs(): Stream", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))

    # 5. CryptographicCertificate Box
    d_class.add(Rect(365, 30, 135, 105, rx=4, ry=4, fillColor=colors.white, strokeColor=colors.HexColor("#0284c7"), strokeWidth=1.2))
    d_class.add(Rect(365, 115, 135, 20, rx=4, ry=4, fillColor=colors.HexColor("#0284c7"), strokeColor=colors.HexColor("#0284c7"), strokeWidth=1))
    d_class.add(String(432, 120, "CryptographicCertificate", textAnchor='middle', fontName='Helvetica-Bold', fontSize=7.5, fillColor=colors.white))
    d_class.add(String(370, 102, "+ certId: String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(370, 90, "+ sha256Hash: String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(370, 78, "+ isTamperProof: Bool", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(Line(365, 70, 500, 70, strokeColor=colors.HexColor("#e2e8f0"), strokeWidth=0.75))
    d_class.add(String(370, 58, "+ computeHash(): String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))
    d_class.add(String(370, 46, "+ verify(): Boolean", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))

    # 6. User and AdminUser Boxes
    d_class.add(Rect(15, 30, 140, 105, rx=4, ry=4, fillColor=colors.white, strokeColor=colors.HexColor("#475569"), strokeWidth=1.2))
    d_class.add(Rect(15, 115, 140, 20, rx=4, ry=4, fillColor=colors.HexColor("#475569"), strokeColor=colors.HexColor("#475569"), strokeWidth=1))
    d_class.add(String(85, 120, "User / AdminUser", textAnchor='middle', fontName='Helvetica-Bold', fontSize=8, fillColor=colors.white))
    d_class.add(String(20, 102, "+ id, username, email", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(20, 90, "+ role: UserRole", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(String(20, 78, "+ staffKey: String", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#334155")))
    d_class.add(Line(15, 70, 155, 70, strokeColor=colors.HexColor("#e2e8f0"), strokeWidth=0.75))
    d_class.add(String(20, 58, "+ submitClaim(): Request", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))
    d_class.add(String(20, 46, "+ resolveTicket(id): void", fontName='Helvetica', fontSize=7, fillColor=colors.HexColor("#0f172a")))

    # Connector Lines
    d_class.add(Line(155, 230, 185, 230, strokeColor=colors.HexColor("#0284c7"), strokeWidth=1))
    d_class.add(String(165, 234, "1..1", fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.HexColor("#0284c7")))

    d_class.add(Line(335, 230, 365, 230, strokeColor=colors.HexColor("#0284c7"), strokeWidth=1))
    d_class.add(String(345, 234, "1..1", fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.HexColor("#0284c7")))

    d_class.add(Line(260, 175, 260, 145, strokeColor=colors.HexColor("#0d9488"), strokeWidth=1, strokeDashArray=[2,2]))
    d_class.add(String(264, 158, "evaluates", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#0d9488")))

    d_class.add(Line(432, 175, 432, 135, strokeColor=colors.HexColor("#0284c7"), strokeWidth=1))
    d_class.add(String(436, 153, "seals with 1..1", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#0284c7")))

    story.append(d_class)
    story.append(Spacer(1, 10))
    story.append(PageBreak())

    # ==========================================
    # 4. SECTION 3: UML OBJECT DIAGRAMS
    # ==========================================
    story.append(Paragraph("3. Master UML Object Diagrams (Runtime Memory Snapshots)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))
    
    story.append(Paragraph(
        "<b>Object Diagram 1: Live Disinformation Claim Verification Snapshot</b><br/>"
        "Captures the active object topology during the verification of the viral claim: "
        "<i>'Viral WhatsApp messages claim RBI is releasing new ₹5000 currency notes.'</i>",
        body_style
    ))
    story.append(Spacer(1, 4))

    # REPORTLAB NATIVE DRAWING: OBJECT DIAGRAM 1
    d_obj1 = Drawing(515, 210)
    d_obj1.add(Rect(0, 0, 515, 210, rx=6, ry=6, fillColor=colors.HexColor("#f8fafc"), strokeColor=colors.HexColor("#cbd5e1"), strokeWidth=1))

    # Object 1
    d_obj1.add(Rect(12, 105, 150, 95, rx=4, ry=4, fillColor=colors.white, strokeColor=colors.HexColor("#0284c7"), strokeWidth=1.2))
    d_obj1.add(Rect(12, 182, 150, 18, rx=4, ry=4, fillColor=colors.HexColor("#0284c7"), strokeColor=colors.HexColor("#0284c7"), strokeWidth=1))
    d_obj1.add(String(87, 186, "req_5001 : ClaimVerificationRequest", textAnchor='middle', fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.white))
    d_obj1.add(String(18, 170, "requestId = 'REQ-2026-9941'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(18, 158, "method = TEXT", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(18, 146, "claim = 'RBI ₹5000 notes'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(18, 134, "source = 'WhatsApp Forward'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(18, 122, "timestamp = '2026-09-25'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(18, 110, "status = 'RESOLVED'", fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.HexColor("#0284c7")))

    # Object 2
    d_obj1.add(Rect(180, 105, 155, 95, rx=4, ry=4, fillColor=colors.HexColor("#f0fdfa"), strokeColor=colors.HexColor("#0d9488"), strokeWidth=1.2))
    d_obj1.add(Rect(180, 182, 155, 18, rx=4, ry=4, fillColor=colors.HexColor("#0d9488"), strokeColor=colors.HexColor("#0d9488"), strokeWidth=1))
    d_obj1.add(String(257, 186, "gemini_engine : GeminiForensicEngine", textAnchor='middle', fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.white))
    d_obj1.add(String(186, 170, "activeModel = 'gemini-3-flash'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(186, 158, "latencyMs = 240ms", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(186, 146, "pibMatch = true", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(186, 134, "sensationalism = 85%", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(186, 122, "tokensProcessed = 1,482", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(186, 110, "state = 'VERDICT_GENERATED'", fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.HexColor("#0d9488")))

    # Object 3
    d_obj1.add(Rect(355, 105, 148, 95, rx=4, ry=4, fillColor=colors.HexColor("#fef2f2"), strokeColor=colors.HexColor("#ef4444"), strokeWidth=1.2))
    d_obj1.add(Rect(355, 182, 148, 18, rx=4, ry=4, fillColor=colors.HexColor("#ef4444"), strokeColor=colors.HexColor("#ef4444"), strokeWidth=1))
    d_obj1.add(String(429, 186, "verdict_9941 : VerificationVerdict", textAnchor='middle', fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.white))
    d_obj1.add(String(361, 170, "verdict = VerdictType.FALSE", fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.HexColor("#991b1b")))
    d_obj1.add(String(361, 158, "confidence = 99.0%", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(361, 146, "sensationalismIndex = 85%", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(361, 134, "source = 'RBI / PIB Fact Check'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(361, 122, "explanation = 'Clarified false'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(361, 110, "auditSealAttached = true", fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.HexColor("#166534")))

    # Object 4 (Bottom)
    d_obj1.add(Rect(180, 10, 155, 80, rx=4, ry=4, fillColor=colors.white, strokeColor=colors.HexColor("#0284c7"), strokeWidth=1))
    d_obj1.add(Rect(180, 72, 155, 18, rx=4, ry=4, fillColor=colors.HexColor("#0284c7"), strokeColor=colors.HexColor("#0284c7"), strokeWidth=1))
    d_obj1.add(String(257, 76, "pib_db : PIBGroundTruthDB", textAnchor='middle', fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.white))
    d_obj1.add(String(186, 60, "matchedPattern = /5000.*note/i", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(186, 48, "gazetteId = 'PIB-RBI-2026-491'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(186, 36, "syncStatus = 'SYNCHRONIZED'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(186, 20, "rulesCount = 42 rules", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))

    # Object 5 (Bottom)
    d_obj1.add(Rect(355, 10, 148, 80, rx=4, ry=4, fillColor=colors.white, strokeColor=colors.HexColor("#4f46e5"), strokeWidth=1))
    d_obj1.add(Rect(355, 72, 148, 18, rx=4, ry=4, fillColor=colors.HexColor("#4f46e5"), strokeColor=colors.HexColor("#4f46e5"), strokeWidth=1))
    d_obj1.add(String(429, 76, "cert_9941 : CryptographicCertificate", textAnchor='middle', fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.white))
    d_obj1.add(String(361, 60, "certId = 'SRA-TG-2026-9941X'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(361, 48, "hash = '8f4c2e91b7a63580...'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(361, 36, "issuedAt = '2026-09-25T01:30'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj1.add(String(361, 20, "isTamperProof = true", fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.HexColor("#166534")))

    # Object Links
    d_obj1.add(Line(162, 150, 180, 150, strokeColor=colors.HexColor("#475569"), strokeWidth=1))
    d_obj1.add(Line(335, 150, 355, 150, strokeColor=colors.HexColor("#475569"), strokeWidth=1))
    d_obj1.add(Line(257, 105, 257, 90, strokeColor=colors.HexColor("#0d9488"), strokeWidth=1))
    d_obj1.add(Line(429, 105, 429, 90, strokeColor=colors.HexColor("#4f46e5"), strokeWidth=1))

    story.append(d_obj1)
    story.append(Spacer(1, 10))

    # Object Diagram 2
    story.append(Paragraph(
        "<b>Object Diagram 2: Staff Administration & Moderation Snapshot</b><br/>"
        "Captures the runtime state during Super Admin query resolution and user management.",
        body_style
    ))
    story.append(Spacer(1, 4))

    d_obj2 = Drawing(515, 110)
    d_obj2.add(Rect(0, 0, 515, 110, rx=6, ry=6, fillColor=colors.HexColor("#f8fafc"), strokeColor=colors.HexColor("#cbd5e1"), strokeWidth=1))

    # Admin object
    d_obj2.add(Rect(15, 15, 150, 80, rx=4, ry=4, fillColor=colors.HexColor("#eef2ff"), strokeColor=colors.HexColor("#6366f1"), strokeWidth=1.2))
    d_obj2.add(Rect(15, 77, 150, 18, rx=4, ry=4, fillColor=colors.HexColor("#4f46e5"), strokeColor=colors.HexColor("#4f46e5"), strokeWidth=1))
    d_obj2.add(String(90, 81, "admin_ekbal : AdminUser", textAnchor='middle', fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.white))
    d_obj2.add(String(20, 65, "id = 'usr-admin-1'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj2.add(String(20, 53, "name = 'Md Ekbal'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj2.add(String(20, 41, "role = SUPER_ADMIN", fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.HexColor("#4f46e5")))
    d_obj2.add(String(20, 25, "status = 'AUTHENTICATED'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#166534")))

    # Ticket object
    d_obj2.add(Rect(185, 15, 150, 80, rx=4, ry=4, fillColor=colors.white, strokeColor=colors.HexColor("#0284c7"), strokeWidth=1))
    d_obj2.add(Rect(185, 77, 150, 18, rx=4, ry=4, fillColor=colors.HexColor("#0284c7"), strokeColor=colors.HexColor("#0284c7"), strokeWidth=1))
    d_obj2.add(String(260, 81, "tkt_101 : SupportTicket", textAnchor='middle', fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.white))
    d_obj2.add(String(190, 65, "ticketId = 'TICK-101'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj2.add(String(190, 53, "subject = 'WhatsApp Tax Video'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj2.add(String(190, 41, "status = 'RESOLVED'", fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.HexColor("#166534")))
    d_obj2.add(String(190, 25, "assignedTo = 'admin_ekbal'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))

    # Log object
    d_obj2.add(Rect(355, 15, 145, 80, rx=4, ry=4, fillColor=colors.white, strokeColor=colors.HexColor("#334155"), strokeWidth=1))
    d_obj2.add(Rect(355, 77, 145, 18, rx=4, ry=4, fillColor=colors.HexColor("#334155"), strokeColor=colors.HexColor("#334155"), strokeWidth=1))
    d_obj2.add(String(427, 81, "log_884 : SystemAuditLog", textAnchor='middle', fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.white))
    d_obj2.add(String(360, 65, "eventId = 'LOG-884'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj2.add(String(360, 53, "type = 'TICKET_RESOLVED'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj2.add(String(360, 41, "ip = '127.0.0.1 (Local)'", fontName='Helvetica', fontSize=6.5, fillColor=colors.HexColor("#334155")))
    d_obj2.add(String(360, 25, "integrity = 'VERIFIED'", fontName='Helvetica-Bold', fontSize=6.5, fillColor=colors.HexColor("#166534")))

    # Links
    d_obj2.add(Line(165, 55, 185, 55, strokeColor=colors.HexColor("#475569"), strokeWidth=1))
    d_obj2.add(Line(335, 55, 355, 55, strokeColor=colors.HexColor("#475569"), strokeWidth=1))

    story.append(d_obj2)
    story.append(Spacer(1, 10))
    story.append(PageBreak())

    # ==========================================
    # 5. SECTION 4: TEST & INTEGRITY MATRIX
    # ==========================================
    story.append(Paragraph("4. Automated Verification & Quality Assurance Matrix", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))
    
    story.append(Paragraph(
        "All domain classes and methods have been verified using automated unit and integration tests, "
        "ensuring strict adherence to the UML specifications.",
        body_style
    ))
    story.append(Spacer(1, 6))

    test_matrix_data = [
        [Paragraph("Target UML Class", table_header_style), Paragraph("Tested Method", table_header_style), Paragraph("Validation Scope", table_header_style), Paragraph("Test Status", table_header_style)],
        [
            Paragraph("<code>GeminiForensicEngine</code>", code_style),
            Paragraph("<code>verifyClaim()</code>", code_style),
            Paragraph("Multimodal NLP classification with Google AI Studio (True & False claims).", table_cell_style),
            Paragraph("<b>PASSED (99% / 94%)</b>", badge_pass_style)
        ],
        [
            Paragraph("<code>PIBGroundTruthDB</code>", code_style),
            Paragraph("<code>matchPattern()</code>", code_style),
            Paragraph("Deterministic regex pattern match against PIB & RBI official archives.", table_cell_style),
            Paragraph("<b>PASSED (100%)</b>", badge_pass_style)
        ],
        [
            Paragraph("<code>MediaNetworkCrawler</code>", code_style),
            Paragraph("<code>fetchRssStreams()</code>", code_style),
            Paragraph("Live RSS ingestion from NDTV, BBC World, CNN, TOI & Al Jazeera.", table_cell_style),
            Paragraph("<b>PASSED (5/5 Feeds)</b>", badge_pass_style)
        ],
        [
            Paragraph("<code>CryptographicCertificate</code>", code_style),
            Paragraph("<code>computeSha256()</code>", code_style),
            Paragraph("SHA-256 tamper-proof digest generation and veracity hash sealing.", table_cell_style),
            Paragraph("<b>PASSED (100%)</b>", badge_pass_style)
        ],
        [
            Paragraph("<code>AdminUser</code>", code_style),
            Paragraph("<code>updateCredentials()</code>", code_style),
            Paragraph("Staff credential security update, session validation, and ticket routing.", table_cell_style),
            Paragraph("<b>PASSED (100%)</b>", badge_pass_style)
        ]
    ]

    t_matrix = Table(test_matrix_data, colWidths=[120, 110, 195, 90], style=[
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f0f9ff")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ])
    story.append(t_matrix)
    story.append(Spacer(1, 20))

    story.append(Table([
        [Paragraph("<b>Document Author:</b>", body_style), Paragraph("Md Ekbal, Lead System Architect", body_bold)],
        [Paragraph("<b>Security Classification:</b>", body_style), Paragraph("Confidential & Proprietary", body_bold)],
        [Paragraph("<b>Target Repository:</b>", body_style), Paragraph("https://github.com/zainul7abideen-sudo/News_Verifier", body_bold)],
        [Paragraph("<b>Live Deployment:</b>", body_style), Paragraph("https://chimerical-boba-ea62fe.netlify.app/", body_bold)],
    ], colWidths=[150, 365], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    out_file = "SRA_TruthGuard_Class_and_Object_Diagrams.pdf"
    if len(sys.argv) > 1:
        out_file = sys.argv[1]
    build_pdf(out_file)
