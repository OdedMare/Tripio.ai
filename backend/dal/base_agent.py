import os
from abc import ABC, abstractmethod
from typing import Generic, TypeVar

from agents import Agent, Runner

TOutput = TypeVar("TOutput")


def is_configured() -> bool:
    return bool(os.environ.get("OPENAI_API_KEY"))


class BaseAgent(ABC, Generic[TOutput]):
    """
    Common contract for every agent in the Tripio agentic system
    (Diagnosis, Trip Planner, Attractions Finder, ...).

    Subclasses declare their persona via `build_agent()` and expose
    a typed `run()` entrypoint their service layer can call.
    """

    name: str

    @abstractmethod
    def build_agent(self) -> Agent:
        """Construct the OpenAI Agent (instructions, output_type, tools)."""
        raise NotImplementedError

    async def run(self, user_prompt: str) -> TOutput:
        agent = self.build_agent()
        result = await Runner.run(agent, user_prompt)
        return result.final_output
