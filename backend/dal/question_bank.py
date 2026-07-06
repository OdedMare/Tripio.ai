from backend.models.diagnosis import DiagnosisOption, DiagnosisQuestion, DiagnosisTraits

FALLBACK_QUESTIONS: list[DiagnosisQuestion] = [
    DiagnosisQuestion(
        id="traveler-type",
        order=1,
        title="What kind of traveler are you?",
        subtitle="There's no wrong answer — just the one that feels most like you.",
        options=[
            DiagnosisOption(
                id="explorer",
                label="The Explorer",
                description="You want to wander, get a little lost, and find what's off the map.",
                icon="compass",
                traits=DiagnosisTraits(travelerType="explorer", interests=["Nature", "Hiking", "Hidden gems"]),
            ),
            DiagnosisOption(
                id="relaxer",
                label="The Relaxer",
                description="You travel to slow down, unwind, and recharge.",
                icon="sun",
                traits=DiagnosisTraits(travelerType="relaxer", interests=["Wellness", "Beaches", "Spas"]),
            ),
            DiagnosisOption(
                id="culture-seeker",
                label="The Culture Seeker",
                description="Museums, history, and local traditions pull you in.",
                icon="landmark",
                traits=DiagnosisTraits(travelerType="culture-seeker", interests=["Art", "History", "Architecture"]),
            ),
            DiagnosisOption(
                id="foodie",
                label="The Foodie",
                description="You plan your day around where you're going to eat.",
                icon="utensils",
                traits=DiagnosisTraits(travelerType="foodie", interests=["Food", "Markets", "Wine"]),
            ),
        ],
    ),
    DiagnosisQuestion(
        id="pace",
        order=2,
        title="What pace do you enjoy?",
        subtitle="Think about your ideal day, not your busiest one.",
        options=[
            DiagnosisOption(
                id="relaxed",
                label="Relaxed",
                description="One or two things a day, with plenty of room to breathe.",
                icon="coffee",
                traits=DiagnosisTraits(pace="relaxed"),
            ),
            DiagnosisOption(
                id="balanced",
                label="Balanced",
                description="A good mix of plans and downtime.",
                icon="scale",
                traits=DiagnosisTraits(pace="balanced"),
            ),
            DiagnosisOption(
                id="adventurous",
                label="Adventurous",
                description="Pack it in — you'd rather see and do more.",
                icon="zap",
                traits=DiagnosisTraits(pace="adventurous"),
            ),
        ],
    ),
    DiagnosisQuestion(
        id="dealbreakers",
        order=3,
        title="What ruins a trip for you?",
        subtitle="Knowing what to avoid is just as important as knowing what you love.",
        options=[
            DiagnosisOption(
                id="rigid-schedules",
                label="Rigid schedules",
                description="Being locked into a fixed itinerary with no flexibility.",
                icon="calendar-x",
                traits=DiagnosisTraits(dealbreakers=["Rigid schedules"]),
            ),
            DiagnosisOption(
                id="tourist-traps",
                label="Tourist traps",
                description="Crowded, overpriced spots that feel inauthentic.",
                icon="camera-off",
                traits=DiagnosisTraits(dealbreakers=["Tourist traps"]),
            ),
            DiagnosisOption(
                id="long-transit",
                label="Long transit times",
                description="Wasting hours getting from one place to another.",
                icon="bus",
                traits=DiagnosisTraits(dealbreakers=["Long transit"]),
            ),
            DiagnosisOption(
                id="uncomfortable-stays",
                label="Uncomfortable stays",
                description="Noisy, cramped, or poorly located hotels.",
                icon="bed-double",
                traits=DiagnosisTraits(dealbreakers=["Uncomfortable stays"]),
            ),
        ],
    ),
    DiagnosisQuestion(
        id="excitement",
        order=4,
        title="What kind of places excite you most?",
        subtitle="Picture the moment you feel most alive on a trip.",
        options=[
            DiagnosisOption(
                id="nature-landscapes",
                label="Nature & landscapes",
                description="Mountains, coastlines, and wide-open views.",
                icon="trees",
                traits=DiagnosisTraits(interests=["Nature", "Scenic views"]),
            ),
            DiagnosisOption(
                id="old-towns",
                label="Old towns & history",
                description="Cobblestone streets and centuries of stories.",
                icon="landmark",
                traits=DiagnosisTraits(interests=["History", "Old towns"]),
            ),
            DiagnosisOption(
                id="buzzing-cities",
                label="Buzzing cities",
                description="Energy, skylines, and nonstop things to do.",
                icon="building-2",
                traits=DiagnosisTraits(interests=["Urban life", "Nightlife"]),
            ),
            DiagnosisOption(
                id="hidden-villages",
                label="Hidden villages",
                description="Quiet, authentic places most visitors skip.",
                icon="map-pin",
                traits=DiagnosisTraits(interests=["Hidden gems", "Local life"]),
            ),
        ],
    ),
    DiagnosisQuestion(
        id="comfort",
        order=5,
        title="How much comfort do you need?",
        subtitle="Be honest — this shapes where you'll actually enjoy staying.",
        options=[
            DiagnosisOption(
                id="backpacker",
                label="Keep it simple",
                description="Hostels or budget stays are perfectly fine.",
                icon="backpack",
                traits=DiagnosisTraits(comfortLevel="backpacker", preferredBudget="budget"),
            ),
            DiagnosisOption(
                id="comfortable",
                label="Comfortable essentials",
                description="A clean, reliable mid-range place to come back to.",
                icon="home",
                traits=DiagnosisTraits(comfortLevel="comfortable", preferredBudget="midRange"),
            ),
            DiagnosisOption(
                id="premium",
                label="Elevated comfort",
                description="Nice touches matter — good beds, good service.",
                icon="gem",
                traits=DiagnosisTraits(comfortLevel="premium", preferredBudget="midRange"),
            ),
            DiagnosisOption(
                id="luxury",
                label="Full luxury",
                description="Top-tier stays are part of the experience.",
                icon="crown",
                traits=DiagnosisTraits(comfortLevel="luxury", preferredBudget="luxury"),
            ),
        ],
    ),
    DiagnosisQuestion(
        id="planning-style",
        order=6,
        title="How spontaneous or planned are you?",
        subtitle="This helps us decide how much structure to build in.",
        options=[
            DiagnosisOption(
                id="fully-planned",
                label="Fully planned",
                description="I want every day mapped out in advance.",
                icon="list-checks",
                traits=DiagnosisTraits(planningStyle="fully-planned"),
            ),
            DiagnosisOption(
                id="loosely-planned",
                label="Loosely planned",
                description="A rough shape with room to change plans.",
                icon="shuffle",
                traits=DiagnosisTraits(planningStyle="loosely-planned"),
            ),
            DiagnosisOption(
                id="spontaneous",
                label="Spontaneous",
                description="Just point me in a direction and let me improvise.",
                icon="dice-5",
                traits=DiagnosisTraits(planningStyle="spontaneous"),
            ),
        ],
    ),
    DiagnosisQuestion(
        id="hotel-style",
        order=7,
        title="What kind of hotels feel right?",
        subtitle="Where you stay sets the tone for the whole trip.",
        options=[
            DiagnosisOption(
                id="boutique",
                label="Boutique & design-led",
                description="Small, characterful properties with a distinct feel.",
                icon="sparkles",
                traits=DiagnosisTraits(hotelStyle="Boutique, design-led"),
            ),
            DiagnosisOption(
                id="resort",
                label="All-in-one resorts",
                description="Everything on site — pools, dining, activities.",
                icon="palmtree",
                traits=DiagnosisTraits(hotelStyle="Resort, all-inclusive"),
            ),
            DiagnosisOption(
                id="local-stays",
                label="Local & independent",
                description="Family-run guesthouses and neighborhood stays.",
                icon="house",
                traits=DiagnosisTraits(hotelStyle="Local, independent"),
            ),
            DiagnosisOption(
                id="flexible-stays",
                label="Flexible & practical",
                description="Apartments or flexible stays near everything.",
                icon="key",
                traits=DiagnosisTraits(hotelStyle="Flexible, apartment-style"),
            ),
        ],
    ),
    DiagnosisQuestion(
        id="food-transport",
        order=8,
        title="How do you like to eat and get around?",
        subtitle="Last one — this rounds out your day-to-day preferences.",
        options=[
            DiagnosisOption(
                id="street-food-walk",
                label="Street food & walking",
                description="Local stalls, markets, and exploring on foot.",
                icon="footprints",
                traits=DiagnosisTraits(foodStyle="Street food, markets", transportStyle="Walking, public transit"),
            ),
            DiagnosisOption(
                id="fine-dining-driver",
                label="Fine dining & private driver",
                description="Reserved tables and door-to-door comfort.",
                icon="car",
                traits=DiagnosisTraits(foodStyle="Fine dining", transportStyle="Private driver"),
            ),
            DiagnosisOption(
                id="casual-rental",
                label="Casual spots & self-drive",
                description="Easygoing meals and the freedom of a rental car.",
                icon="car-front",
                traits=DiagnosisTraits(foodStyle="Casual, local favorites", transportStyle="Self-drive rental"),
            ),
            DiagnosisOption(
                id="mixed-transit",
                label="A bit of everything",
                description="Mixing it up with trains, taxis, and local transit.",
                icon="train",
                traits=DiagnosisTraits(foodStyle="Mixed, adventurous", transportStyle="Mixed transit"),
            ),
        ],
    ),
]


def get_fallback_question(answered_count: int) -> DiagnosisQuestion:
    index = min(answered_count, len(FALLBACK_QUESTIONS) - 1)
    question = FALLBACK_QUESTIONS[index]
    return question.model_copy(update={"order": answered_count + 1})
