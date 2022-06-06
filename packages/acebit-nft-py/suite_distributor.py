
import helpers

BATCH = helpers.get_config()["BATCH"]


class SuiteDistributor:
    def __init__(self) -> None:
        self.batchSize = BATCH
        self.suiteOrder = ["SPADES", "CLUBS", "HEARTS", "DIAMONDS"]
        self.currentSuite = 0

    def toggleSuite(self):

        if self.currentSuite == 3:
            self.currentSuite = 0

        self.currentSuite += 1
        return None

    def getSuite(self):
        _suite = self.suiteOrder[self.currentSuite]

        self.toggleSuite()
        return _suite
