import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

NCERT_CHAPTERS = {
    "Physics": {
        "11": ["Physical World","Units and Measurements","Motion in a Straight Line","Motion in a Plane","Laws of Motion","Work, Energy and Power","System of Particles and Rotational Motion","Gravitation","Mechanical Properties of Solids","Mechanical Properties of Fluids","Thermal Properties of Matter","Thermodynamics","Kinetic Theory","Oscillations","Waves"],
        "12": ["Electric Charges and Fields","Electrostatic Potential and Capacitance","Current Electricity","Moving Charges and Magnetism","Magnetism and Matter","Electromagnetic Induction","Alternating Current","Electromagnetic Waves","Ray Optics and Optical Instruments","Wave Optics","Dual Nature of Radiation and Matter","Atoms","Nuclei","Semiconductor Electronics"],
    },
    "Chemistry": {
        "11": ["Some Basic Concepts of Chemistry","Structure of Atom","Classification of Elements and Periodicity in Properties","Chemical Bonding and Molecular Structure","States of Matter","Thermodynamics","Equilibrium","Redox Reactions","Hydrogen","The s-Block Elements","The p-Block Elements","Organic Chemistry Basic Principles","Hydrocarbons","Environmental Chemistry"],
        "12": ["The Solid State","Solutions","Electrochemistry","Chemical Kinetics","Surface Chemistry","General Principles of Isolation of Elements","The p-Block Elements","The d and f Block Elements","Coordination Compounds","Haloalkanes and Haloarenes","Alcohols, Phenols and Ethers","Aldehydes, Ketones and Carboxylic Acids","Amines","Biomolecules","Polymers","Chemistry in Everyday Life"],
    },
    "Mathematics": {
        "11": ["Sets","Relations and Functions","Trigonometric Functions","Principle of Mathematical Induction","Complex Numbers and Quadratic Equations","Linear Inequalities","Permutations and Combinations","Binomial Theorem","Sequences and Series","Straight Lines","Conic Sections","Introduction to Three Dimensional Geometry","Limits and Derivatives","Statistics","Probability"],
        "12": ["Relations and Functions","Inverse Trigonometric Functions","Matrices","Determinants","Continuity and Differentiability","Application of Derivatives","Integrals","Application of Integrals","Differential Equations","Vector Algebra","Three Dimensional Geometry","Linear Programming","Probability"],
    },
    "Biology": {
        "11": ["The Living World","Biological Classification","Plant Kingdom","Animal Kingdom","Morphology of Flowering Plants","Anatomy of Flowering Plants","Structural Organisation in Animals","Cell: The Unit of Life","Biomolecules","Cell Cycle and Cell Division","Transport in Plants","Mineral Nutrition","Photosynthesis in Higher Plants","Respiration in Plants","Plant Growth and Development","Digestion and Absorption","Breathing and Exchange of Gases","Body Fluids and Circulation","Excretory Products and their Elimination","Locomotion and Movement","Neural Control and Coordination","Chemical Coordination and Integration"],
        "12": ["Reproduction in Organisms","Sexual Reproduction in Flowering Plants","Human Reproduction","Reproductive Health","Principles of Inheritance and Variation","Molecular Basis of Inheritance","Evolution","Human Health and Disease","Strategies for Enhancement in Food Production","Microbes in Human Welfare","Biotechnology: Principles and Processes","Biotechnology and its Applications","Organisms and Populations","Ecosystem","Biodiversity and Conservation","Environmental Issues"],
    },
    "English": {
        "12": ["The Last Lesson","Lost Spring","Deep Water","The Rattrap","Indigo","Poets and Pancakes","The Interview","Going Places","My Mother at Sixty-six","An Elementary School Classroom in a Slum","Keeping Quiet","A Thing of Beauty","A Roadside Stand","Aunt Jennifer's Tigers","The Third Level","The Tiger King","Journey to the End of the Earth","The Enemy","Should Wizard Hit Mommy","On the Face of It","Evans Tries an O-level","Memories of Childhood"],
    },
}

ICSE_CHAPTERS = {
    "Physics": {
        "10": ["Force","Work, Energy and Power","Machines","Refraction of Light at Plane Surfaces","Refraction through a Lens","Spectrum","Sound","Current Electricity","Household Circuits","Magnetic Effects of Current","Electromagnetism","Calorimetry","Radioactivity","Nuclear Energy"],
        "12": ["Electrostatics","Current Electricity","Magnetic Fields and Effects","Electromagnetic Induction","Alternating Currents","Electrons and Photons","Atoms, Molecules and Nuclei","Semiconductor Devices","Communication Systems"],
    },
    "Chemistry": {
        "10": ["Periodic Table","Chemical Bonding","Acids, Bases and Salts","Analytical Chemistry","Mole Concept","Electrolysis","Metallurgy","Study of Compounds","Organic Chemistry","Practical Chemistry"],
        "12": ["Solid State","Solutions","Electrochemistry","Chemical Kinetics","Surface Chemistry","Isolation of Metals","p-Block Elements","d and f Block Elements","Coordination Compounds","Organic Halogen Compounds","Alcohols and Phenols","Aldehydes and Ketones","Carboxylic Acids","Organic Nitrogen Compounds","Polymers","Chemistry in Everyday Life"],
    },
    "Mathematics": {
        "10": ["Commercial Mathematics","Algebra","Geometry","Mensuration","Trigonometry","Statistics","Probability"],
        "12": ["Relations and Functions","Algebra of Matrices","Determinants","Continuity and Differentiability","Application of Derivatives","Integrals","Differential Equations","Vectors","Three-Dimensional Geometry","Linear Programming","Probability Distribution","Index Numbers","Time Series","Linear Regression"],
    },
    "Biology": {
        "10": ["Cell Cycle and Chromosomes","Genetics","Absorption by Roots","Transpiration","Photosynthesis","The Circulatory System","The Excretory System","The Nervous System","The Endocrine System","The Reproductive System","Population","Human Evolution","Pollution"],
    },
}

EXAM_STRATEGY = {
    "JEE": "JEE prep. Rotate Physics-Maths-Chemistry daily. Prioritize: Mechanics, Electromagnetism, Optics (Phy); Calculus, Algebra, Coordinate Geometry (Math); Organic reactions, Physical Chemistry (Chem). Minimum 20 numericals per session. Include JEE PYQs from Week 2.",
    "NEET": "NEET prep. Biology gets 50% of daily time, Chemistry 30%, Physics 20%. Biology: NCERT line-by-line, draw every diagram. Daily NEET MCQs and assertion-reason questions. Zero chapter skipping.",
    "Boards": "Board exam prep. Follow NCERT strictly. Equal time per subject. Include chapter-end exercises. Final week: only sample papers and board PYQs.",
    "UPSC": "UPSC prep. Conceptual understanding + answer writing daily. Include newspaper reading slot. Rotate GS papers.",
    "CAT": "CAT prep. Rotate QA-VARC-DILR. Daily 30-min timed sectional mock. Error analysis after each mock.",
    "Other": "Well-paced plan with clear daily goals, revision cycles, and practice sessions.",
}

EXAM_WEIGHTS = {
    "JEE":  {"Physics": 34, "Mathematics": 33, "Chemistry": 33},
    "NEET": {"Biology": 50, "Chemistry": 30, "Physics": 20},
}


def _get_chapters(subject, board, class_name):
    ck = class_name.replace("Class ","").replace("class ","").strip()
    if board == "CBSE" and subject in NCERT_CHAPTERS:
        ch = NCERT_CHAPTERS[subject].get(ck, [])
        if not ch:
            ch = NCERT_CHAPTERS[subject].get("11",[]) + NCERT_CHAPTERS[subject].get("12",[])
        return ch, "NCERT/CBSE"
    if board == "ICSE" and subject in ICSE_CHAPTERS:
        ch = ICSE_CHAPTERS[subject].get(ck, [])
        if not ch:
            ch = []
            for v in ICSE_CHAPTERS[subject].values(): ch.extend(v)
        return ch, "ICSE"
    return [], board


def generate_study_plan(subjects, weeks, hours, exam="", board="", class_name="", name="", history=None):
    if history is None:
        history = []

    # Normalise to list
    if isinstance(subjects, str):
        subject_list = [s.strip() for s in subjects.split(",") if s.strip()]
    else:
        subject_list = [s.strip() for s in subjects if s.strip()]

    is_multi   = len(subject_list) > 1
    total_days = weeks * 7

    exam_note = EXAM_STRATEGY.get(exam, EXAM_STRATEGY["Other"])

    # Chapter blocks
    chapter_blocks = []
    for subj in subject_list:
        chapters, source = _get_chapters(subj, board, class_name)
        if chapters:
            lines = "\n".join(f"    - {c}" for c in chapters)
            chapter_blocks.append(f"{subj} ({source}):\n{lines}")

    ncert_note = ""
    if chapter_blocks:
        ncert_note = "CHAPTER MAPS (use exact names, cover ALL in order):\n\n" + "\n\n".join(chapter_blocks)

    history_note = ""
    if history:
        past = "\n".join(f"  - {h}" for h in history[-5:])
        history_note = f"STUDENT HISTORY (don't repeat, build on this):\n{past}"

    identity = " | ".join(filter(None, [
        f"Name: {name}" if name else "",
        f"Exam: {exam}" if exam else "",
        f"Board: {board}" if board else "",
        f"Class: {class_name}" if class_name else "",
    ])) or "Student"

    # Interleaving instruction
    if is_multi:
        weights = EXAM_WEIGHTS.get(exam, {})
        rel = {s: weights[s] for s in subject_list if s in weights}
        if rel:
            wline = ", ".join(f"{s}: {w}%" for s,w in rel.items())
            interleave = f"SUBJECT ALLOCATION ({exam} weightage): {wline}. More tasks for higher-weight subjects."
        else:
            interleave = f"Each day must include tasks from ALL subjects: {', '.join(subject_list)}. Rotate evenly."
    else:
        interleave = ""

    # Time per subject per day
    n_subjects = len(subject_list)
    if is_multi:
        # Use exam weights if available, else equal split
        weights = EXAM_WEIGHTS.get(exam, {})
        rel = {s: weights.get(s, 100 // n_subjects) for s in subject_list}
        total_w = sum(rel.values())
        time_per_subject = {
            s: round((w / total_w) * hours, 1)
            for s, w in rel.items()
        }
        time_breakdown = ", ".join(f"{s}: {t}h" for s, t in time_per_subject.items())
    else:
        time_per_subject = {subject_list[0]: hours}
        time_breakdown   = f"{subject_list[0]}: {hours}h"

    # Task depth per hour per subject
    def depth_for_hours(h):
        if h <= 1:   return "1 concept + 10 MCQs"
        if h <= 1.5: return "1 concept + 15 MCQs"
        if h <= 2:   return "2 concepts + 20 MCQs"
        if h <= 2.5: return "2 concepts + 25 MCQs + 1 PYQ"
        if h <= 3:   return "2-3 concepts + 30 MCQs + 1 PYQ set"
        if h <= 4:   return "3 concepts + 40 MCQs + 2 PYQ sets"
        if h <= 5:   return "3-4 concepts + 50 MCQs + 2 PYQ sets + revision notes"
        if h <= 6:   return "4 concepts + 60 MCQs + 3 PYQ sets + revision notes"
        if h <= 7:   return "4-5 concepts + 70 MCQs + 3 PYQ sets + full chapter revision"
        if h <= 8:   return "5 concepts + 80 MCQs + 4 PYQ sets + mock test section"
        return               "6 concepts + 90 MCQs + full mock test + revision"

    subject_depth_lines = "\n".join(
        f"  {s}: {t}h/day → {depth_for_hours(t)}"
        for s, t in time_per_subject.items()
    )
    task_depth = f"Total {hours}h/day split as:\n{subject_depth_lines}"

    prompt = f"""You are Dhruva AI — India's most precise academic study planner.

STUDENT: {identity}
SUBJECTS: {", ".join(subject_list)}
DURATION: {weeks} weeks = {total_days} days exactly
HOURS/DAY: {hours}h total → {time_breakdown}

DEPTH PER SUBJECT:
{task_depth}

EXAM STRATEGY: {exam_note}

{interleave}

{ncert_note}

{history_note}

RULES:
1. Output EXACTLY {total_days} day objects.
2. Each day: tasks must cover ALL subjects with time matching the breakdown above.
3. Every task names a SPECIFIC chapter/topic. No generic tasks.
4. Task format: "[Subject] – [Chapter]: [action] ([time]min or quantity)"
   Example: "Physics – Laws of Motion: solve 20 Newton numericals (45min)"
5. Day 7, 14, 21... = Revision Day: review week + timed mock test per subject.
6. Last 3 days = Full revision + sample paper practice.
7. Match task count and depth to each subject's allocated hours.
{'8. Multi-subject: at least 1 task per subject per day.' if is_multi else ''}

Return ONLY valid JSON. No markdown. No explanation.

{{"days": [{{"day": 1, "tasks": ["Subject – Chapter: action (quantity)"]}}]}}"""

    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.45,
    )

    text = resp.choices[0].message.content.strip()
    text = text.replace("```json","").replace("```","").strip()
    return text