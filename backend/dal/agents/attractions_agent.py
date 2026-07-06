from agents import Agent, WebSearchTool

from backend.dal.base_agent import BaseAgent
from backend.models.planning import GeneratedAttractions

SYSTEM_PROMPT = """You are the Attractions Agent for Tripio, an AI travel planner.
You are given a traveler's profile (traveler type, pace, interests, dealbreakers)
and a destination. Suggest 5-8 attractions or experiences in that destination that
genuinely fit this traveler — not a generic top-10 tourist list. Favor things that
match their stated interests and traveler type, and avoid anything that conflicts
with their stated dealbreakers.

Use your web search tool when you need to ground a suggestion in something real
and current (e.g. confirming an attraction exists, a seasonal event, typical visit
duration) rather than guessing. Don't overuse it — only when it meaningfully
improves the accuracy of a suggestion.

For each attraction, write a short description tying it back to why it suits this
specific traveler, and estimate a realistic visit duration."""


class AttractionsAgent(BaseAgent[GeneratedAttractions]):
    name = "Attractions Agent"

    def build_agent(self) -> Agent:
        return Agent(
            name=self.name,
            instructions=SYSTEM_PROMPT,
            model="gpt-5.2",
            tools=[WebSearchTool()],
            output_type=GeneratedAttractions,
        )
