// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "../Interfaces/IPoolSetup.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Interfaces/IGameToken.sol";
import "./Interfaces/IGameSetup.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Gamer is Ownable, IUniswapV3SwapCallback {

    IGameToken public commonToken;
    IGameToken public rareToken;
    address public pool;
    bool tokensReversed = false;
    uint160 internal constant minsqrt = 4295128739;
    uint160 internal constant maxsqrt = 1461446703485210103287273052203988822378723970342;


    constructor(address _poolSetup) {
        //get new Tokens
        IPoolSetup poolSetup = IPoolSetup(_poolSetup);
        address _commonToken = poolSetup.getCommonToken();
        address _rareToken = poolSetup.getRareToken();
        commonToken = IGameToken(_commonToken);
        rareToken = IGameToken(_rareToken);

        //get pool for the new tokens
        pool = poolSetup.getPool();
        address poolToken0 = IUniswapV3Pool(pool).token0();
        if (poolToken0 != _commonToken) {
            tokensReversed = true;
        }
    }

    function uniswapV3SwapCallback(
        int256 amountCommonDelta,
        int256 amountRareDelta,
        bytes calldata data
    ) override external {
    require(msg.sender == pool, "PCB");
        if (tokensReversed) {
            int256 inter = amountRareDelta;
            amountRareDelta = amountCommonDelta;
            amountCommonDelta = inter;
        }
        if (amountCommonDelta >= 0) {
            IERC20(commonToken).transfer(msg.sender, uint(amountCommonDelta));
        }
        if (amountRareDelta >= 0) {
            IERC20(rareToken).transfer(msg.sender, uint(amountRareDelta));
        }
    }

    function swap(
        //address recipient,
        bool commonForRare,
        int256 amountSpecified
        //uint160 sqrtPriceLimitX96
    ) external onlyOwner {
        if (tokensReversed) {
            commonForRare = !commonForRare;
        }
        uint160 sqrtPriceLimitX96;
        if (commonForRare) {
            sqrtPriceLimitX96 = minsqrt+1;
        }
        else {
            sqrtPriceLimitX96 = maxsqrt -1;
        }
        address recipient = address(this);
        IUniswapV3Pool(pool).swap(recipient, commonForRare, amountSpecified, sqrtPriceLimitX96, "");
    }

    function getFunds(address adr) public view returns(uint256 t0, uint256 t1) {
        t0 = IERC20(address(commonToken)).balanceOf(adr);
        t1 = IERC20(address(rareToken)).balanceOf(adr);
    }

    function getPoolFunds() public view returns(uint256 t0, uint256 t1) {
         (t0, t1) = getFunds(pool);
    }

    function getGamerFunds() public view returns(uint256 t0, uint256 t1) {
        (t0, t1) = getFunds(address(this));
    }

    function getPool() public view returns (address) {
        return pool;
    }
}
