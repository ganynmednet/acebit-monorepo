# wizard
https://wizard.openzeppelin.com/


# Deploy mock contracts
npx hardhat run scripts/mock/deploy_DAI.js --network mumbai

# Deploy contracts
npx hardhat run scripts/001_deploy_AceBit.js --network mumbai
npx hardhat run scripts/002_deploy_UserStorage.js --network mumbai
npx hardhat run scripts/003_deploy_aAceBit.js --network mumbai



# Verification

npx hardhat verify 0xbEF42F43a5625fcfA822C7c8214565EC952cd682 --network mumbai
npx hardhat verify 0x31A378D024fe1A4f21205B2cA755F8F0a4DA9346 --network mumbai 0xDf05CE25B93A11D0a39439E6f6b4D7E3bB554543
npx hardhat verify 0x0a2504aeAfAc0Ee1C5A84962cfd5395057A7005e --network mumbai
npx hardhat verify 0x72727aA1Fa95660e7c67643eeF568891c3F936Fe --network mumbai 0


# Support
npx hardhat clean