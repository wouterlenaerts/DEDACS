// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3MintCallback.sol";
import "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "./Interfaces/IPoolSetup.sol";
//import "@uniswap/v3-core/contracts/UniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
//import "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/libraries/LiquidityAmounts.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "../Libraries/Logarithm.sol";
import "./GameTokens/Interfaces/IGameToken.sol";
import "./GameTokens/Interfaces/IGameSetup.sol";

contract PoolSetup is IPoolSetup, IUniswapV3MintCallback, IUniswapV3SwapCallback {

    //address public token0 = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    //address public token1 = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512;
    address public holder;// = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    uint24 public fee = 3000; 
    address public factory;
    IGameToken public commonToken;
    IGameToken public rareToken;
    int24 tickLower = -887220;
    int24 tickUpper = 887220;
    int24 public f =0;

    address public pool;
    bool tokensReversed = false;

    constructor(address _commonToken, address _rareToken, address _factory) {
        holder = msg.sender;
        //UniswapV3Factory _factory = new UniswapV3Factory();
        factory = address(_factory);

        // //get new Tokens
        // IGameSetup gameSetup = IGameSetup(_gameSetup);
        // address _commonToken = gameSetup.getCommonToken();
        // address _rareToken = gameSetup.getRareToken();
        commonToken = IGameToken(_commonToken);
        rareToken = IGameToken(_rareToken);

        //create pool for the new tokens
        pool = IUniswapV3Factory(factory).createPool(address(commonToken), address(rareToken), fee);
        address poolToken0 = IUniswapV3Pool(pool).token0();
        //address poolToken1 = IUniswapV3Pool(pool).token1();
        // //Make sure token0 of minter and pool are the same and not swapped.
        if (poolToken0 != _commonToken) {
            tokensReversed = true;
        }
        // token0 = MyToken(poolToken0);
        // token1 = MyToken(poolToken1);
    }
    // constructor(address _gameSetup) {
    //     holder = msg.sender;
    //     UniswapV3Factory _factory = new UniswapV3Factory();
    //     factory = address(_factory);

    //     //get new Tokens
    //     IGameSetup gameSetup = IGameSetup(_gameSetup);
    //     address _commonToken = gameSetup.getCommonToken();
    //     address _rareToken = gameSetup.getRareToken();
    //     commonToken = IGameToken(_commonToken);
    //     rareToken = IGameToken(_rareToken);

    //     //create pool for the new tokens
    //     pool = IUniswapV3Factory(factory).createPool(address(commonToken), address(rareToken), fee);
    //     address poolToken0 = IUniswapV3Pool(pool).token0();
    //     //address poolToken1 = IUniswapV3Pool(pool).token1();
    //     // //Make sure token0 of minter and pool are the same and not swapped.
    //     if (poolToken0 != _commonToken) {
    //         tokensReversed = true;
    //     }
    //     // token0 = MyToken(poolToken0);
    //     // token1 = MyToken(poolToken1);
    // }

    function uniswapV3MintCallback(
        uint256 amountCommonOwed,
        uint256 amountRareOwed,
        bytes calldata data
    ) override external {
        require(msg.sender == pool, "PCB");
        if (tokensReversed) {
            uint256 inter = amountRareOwed;
            amountRareOwed = amountCommonOwed;
            amountCommonOwed = inter;
        }
        commonToken.transfer(msg.sender, amountCommonOwed);
        rareToken.transfer(msg.sender, amountRareOwed);
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

    /*
     * This function initializes the pool and mints a new position with tick lower and tick upper.
     * After execution, the pool will have amount0 of token0 and amount1 of token1.
     */
    function mintPool(uint128 amountCommon, uint128 amountRare) override external {
        address recipient = msg.sender;
        int24 initialTick;
        if (tokensReversed) {
            uint128 inter = amountRare;
            amountRare = amountCommon;
            amountCommon = inter;
        }
        if (amountCommon >= amountRare) {
            initialTick = int24(Logarithm.log10001(amountCommon/amountRare));
            initialTick = -initialTick;
        }
        else {
            initialTick = int24(Logarithm.log10001(amountRare/amountCommon));
        }
        f = int24(initialTick);
        uint160 initialSqrtPrice = TickMath.getSqrtRatioAtTick(f);

        IUniswapV3Pool(pool).initialize(initialSqrtPrice);

        uint liquidity = sqrt(amountCommon*amountRare);
        uint128 l = uint128(liquidity);

        IUniswapV3Pool(pool).mint(recipient, tickLower, tickUpper, l, "");
    }

    /*
     * Calculates floor of sqrt x
     */
    function sqrt(uint x) public pure returns (uint y) {
        //source https://ethereum.stackexchange.com/questions/2910/can-i-square-root-in-solidity
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    
    }

    function calculateLiquidity(address poolAdr, uint256 amountCommonDesired, uint256 amountRareDesired) view external returns (uint128 liquidity) {
        if (tokensReversed) {
            uint256 inter = amountRareDesired;
            amountRareDesired = amountCommonDesired;
            amountCommonDesired = inter;
        }
        (uint160 sqrtPriceX96, , , , , , ) = IUniswapV3Pool(poolAdr).slot0();
            uint160 sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
            uint160 sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);

            liquidity = LiquidityAmounts.getLiquidityForAmounts(
                sqrtPriceX96,
                sqrtRatioAX96,
                sqrtRatioBX96,
                amountCommonDesired,
                amountRareDesired
            );
    }
    function swap(
        address recipient,
        bool commonForRare,
        int256 amountSpecified,
        uint160 sqrtPriceLimitX96
    ) override external {
        if (tokensReversed) {
            commonForRare = !commonForRare;
        }
        IUniswapV3Pool(pool).swap(recipient, commonForRare, amountSpecified, sqrtPriceLimitX96, "");
    }

    function getFunds(address adr) public view returns(uint256 t0, uint256 t1) {
        t0 = IERC20(address(commonToken)).balanceOf(adr);
        t1 = IERC20(address(rareToken)).balanceOf(adr);
    }

    function getPoolFunds() public override view returns(uint256 t0, uint256 t1) {
         (t0, t1) = getFunds(pool);
    }

     function getHolderFunds() public override view returns(uint256 t0, uint256 t1) {
        (t0, t1) = getFunds(holder);
    }

    function getMinterFunds() public override view returns(uint256 t0, uint256 t1) {
        (t0, t1) = getFunds(address(this));
    }

    /* Suppose y = 2x => sqrtP = sqrt(2)
     * tick = log1.0001(2^1)
     * sqrtPrice = getSqrtRatioAtTick(tick); => met deze sqrtPrice de pool initialiseren

     vb 2: 
     tick = log1.0001(2^2) = 13864
     => sqrtPrice =  getSqrtRatioAtTick(13864)
     initialize(sqrtPricee)
     funds pool: ongeveer 4x zoveel t1 als t0.
     */
    function getSqrtRatioAtTick(int24 tick) public view returns (uint160 sqrtPriceX96) {
        sqrtPriceX96 = TickMath.getSqrtRatioAtTick(tick);
    }
    
    function getTickAtSqrtRatio(uint160 sqrtPriceX96) public view returns (int24 tick) {
        tick = TickMath.getTickAtSqrtRatio(sqrtPriceX96);
    }

    function getPool() public view override returns (address) {
        return pool;
    }

    function getCommonToken() public override view returns (address) {
        return address(commonToken);
    }

    function getRareToken() public override view returns (address) {
        return address(rareToken);
    }
}
