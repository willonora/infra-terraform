import logging
import os
import re
import json
from typing import List, Dict

class OutputFormatter:
    def __init__(self, output_format: str = "json"):
        self.output_format = output_format

    def format_output(self, data: Dict) -> str:
        if self.output_format == "json":
            return json.dumps(data)
        elif self.output_format == "text":
            return self._format_text_output(data)
        else:
            raise ValueError(f"Unsupported output format: {self.output_format}")

    def _format_text_output(self, data: Dict) -> str:
        formatted_output = ""
        for key, value in data.items():
            formatted_output += f"{key}: {value}\n"
        return formatted_output

def slugify(value: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "-", value).lower()

def get_file_contents(file_path: str) -> str:
    try:
        with open(file_path, "r") as file:
            return file.read()
    except FileNotFoundError:
        logging.error(f"File not found: {file_path}")
        return ""

def get_file_lines(file_path: str) -> List[str]:
    return get_file_contents(file_path).splitlines()

def get_config_variable(variable_name: str, config_file: str = ".env") -> str:
    return os.environ.get(variable_name, get_file_contents(config_file).split(f"{variable_name}=")[1].split("\n")[0])