from app.connectors.jobvetta import JobvettaConnector
from app.connectors.himalayas import HimalayasConnector
from app.connectors.arbeitnow import ArbeitnowConnector
from app.connectors.remoteok import RemoteOkConnector
from app.connectors.greenhouse import GreenhouseConnector
from app.connectors.lever import LeverConnector


def get_active_connectors():
    """
    Returns instances of the 6 verified, free and open job discovery connectors:
    1. Jobvetta – Indian job listings
    2. Himalayas – International remote jobs
    3. Arbeitnow – International jobs
    4. RemoteOK – Remote jobs
    5. Greenhouse – Direct company jobs
    6. Lever – Direct company jobs
    """
    return [
        JobvettaConnector(),
        HimalayasConnector(),
        ArbeitnowConnector(),
        RemoteOkConnector(),
        GreenhouseConnector(),
        LeverConnector()
    ]


__all__ = [
    "JobvettaConnector",
    "HimalayasConnector",
    "ArbeitnowConnector",
    "RemoteOkConnector",
    "GreenhouseConnector",
    "LeverConnector",
    "get_active_connectors"
]
