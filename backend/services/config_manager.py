import os
import threading
import copy

import yaml

CONFIG_PATH = os.path.join(os.path.dirname(__file__), "..", "config.yaml")
CONFIG_PATH = os.path.abspath(CONFIG_PATH)

_lock = threading.Lock()


def _deep_merge(base: dict, updates: dict) -> dict:
    merged = copy.deepcopy(base)
    for key, value in updates.items():
        if key in merged and isinstance(merged[key], dict) and isinstance(value, dict):
            merged[key] = _deep_merge(merged[key], value)
        else:
            merged[key] = copy.deepcopy(value)
    return merged


def read_config() -> dict:
    with _lock:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)


def write_config(updates: dict) -> dict:
    with _lock:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            current = yaml.safe_load(f) or {}

        merged = _deep_merge(current, updates)

        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            yaml.dump(merged, f, default_flow_style=False, allow_unicode=True)

        return merged
