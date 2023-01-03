// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;


interface IPoolSetup {

    function mintPool(uint128 amountCommon, uint128 amountRare) external;
    function swap(
        address recipient,
        bool commonForRare,
        int256 amountSpecified,
        uint160 sqrtPriceLimitX96
    ) external;

    function getPoolFunds() external view returns(uint256 t0, uint256 t1);
    function getHolderFunds() external view returns(uint256 t0, uint256 t1);
    function getMinterFunds() external view returns(uint256 t0, uint256 t1);
    function getPool() external view returns (address);
    function getCommonToken() external view returns (address);
    function getRareToken() external view returns (address);

}
