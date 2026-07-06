import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Generic, TypeVar

from agents import Agent, Runner

TOutput = TypeVar("TOutput")


def is_configured() -> bool:
    return bool(os.environ.get("OPENAI_API_KEY"))


@dataclass
class AgentTrace(Generic[TOutput]):
    """The result of an agent run, plus what model ran and what it said."""

    output: TOutput
    model: str
    raw_response: str


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

    async def run_traced(self, user_prompt: str) -> AgentTrace[TOutput]:
        """Like `run`, but also surfaces the model name and raw final output
        so callers can show the user what the model actually returned."""
        agent = self.build_agent()
        result = await Runner.run(agent, user_prompt)
        return AgentTrace(
            output=result.final_output,
            model=str(agent.model or "default"),
            raw_response=str(result.final_output),
        )
