<script lang="ts">
import HeadingOne from "@/components/HeadingOne.vue";
import CommonMixin from "@/helpers/mixins/CommonMixin";
import { Options } from "vue-class-component";

@Options({
  components: {
    HeadingOne,
  },
})
export default class HomeView extends CommonMixin {
  mounted() { }
}
</script>

<template>
  <HeadingOne />
  <main class="page">
    <section class="hero">
      <div class="hero__bg">
        <picture>
          <source srcset="img/images/bg.webp" type="image/webp" />
          <img src="img/images/bg.png" alt="" />
        </picture>
      </div>
      <div class="hero__content">
        <div class="_container">
          <div class="hero__row">
            <div class="hero__left">
              <h1 class="title hero__title" style="color: #89efc8">
                LUNAR RABBIT
              </h1>
              <div class="hero__slogan" style="color: #ffffff">
                It is the year of the Rabbit and LunarRabbit is combining
                the best parts of Meme token with great Utilities, to
                commemorate this wonderful year. 新年快乐!
              </div>
              <a href="#" class="btn">Buy LunarRabbit</a>
            </div>
            <div class="hero__img">
              <picture>
                <source class="baby" srcset="img/images/baby.png" type="image/png" />
                <img class="baby" src="img/images/baby.png" alt="" style="width: 90%; margin-right: -200px" />
              </picture>
            </div>
          </div>
          <div class="hero__bottom">
            <ul class="hero__list" style="color: #f93232">
              <li style="color: #ffffff">Auto Reward System</li>
              <li style="color: #ffffff">Team KYC & Audit</li>
              <li style="color: #ffffff">Experienced Devs</li>
            </ul>
            <!-- <div class="hero__block" style="color:#ffffff;">
								<div>
									<span style="color:#ffffff;">BSC CONTRACT:</span>
									<p style="color:#ffffff;">0x1c3984CcA3D0337Bd8a34Df00A4693b70852826D</p>
								</div>
								<div>
									<span style="color:#ffffff;">LOW TAX:</span>
									<p style="color:#ffffff;">Buy 3%/ Sell 5%</p>
								</div>
							</div>  -->
            <div class="hero__stores hero-stores">
              <!-- <div class="hero-stores__item">
									<div class="flip-container" ontouchstart="this.classList.toggle('hover');">
										<div class="flipper">
											<div class="front">
												<img src="img/icons/apple.svg" alt="">
											</div>
											<div class="back">
												<img src="img/icons/flip-back.svg" alt="">
												<a href="#"></a>
											</div>
										</div>
									</div>
								</div>  
								<div class="hero-stores__item">
									<div class="flip-container" ontouchstart="this.classList.toggle('hover');">
										<div class="flipper">
											<div class="front">
												<img src="img/icons/google.svg" alt="">
											</div>
											<div class="back">
												<img src="img/icons/flip-back.svg" alt="">
												<a href="#"></a>
											</div>
										</div>
									</div>
								</div>  -->
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="play">
      <!--	<div class="play__decor1">
					<picture>
						<source srcset="img/play/1.webp" type="image/webp">
						<img src="img/play/1.png" alt="">
					</picture>
				</div>
				<div class="play__decor2">
					<picture>
						<source srcset="img/play/2.webp" type="image/webp">
						<img src="img/play/2.png" alt="">
					</picture>
				</div> -->
      <div class="_container" style="color: #f93232">
        <h3 class="title play__title" style="color: #89efc8">
          The LunarRabbit Ecosystem
        </h3>
        <div class="play__row">
          <div class="text16 play__text" style="color: #ffffff">
            The Lunar Rabbit ecosystem is an intricate network of utilities
            such as the $LunarRabbit Token, LunarRabbit NFT Collection,
            Rabbit Run2Earn Game. Designed to offer several passive income
            avenue to investors.
          </div>
          <div class="text16 play__text" style="color: #ffffff">
            Investors can earn good reward from playing the Rabbit
            Run-To-Earn Game, get reward from the reflection system of the
            token and earn massive rewards from the Lunar Rabbit NFT that
            they hold, by staking the NFT or selling them for good profits.
          </div>
        </div>
        <div class="play__video" data-popup="#video" data-popup-youtube="P7_aJ7BbTqc"></div>
      </div>
    </section>

    <section class="contract">
      <div class="_container">
        <h3 class="title contract__title" style="color: #89efc8">
          STRATEGIC SMART CONTRACT
        </h3>
        <div class="contract__row">
          <div class="contract__left">
            <div class="contract__content">
              <div class="contract__block">
                <div class="contract__subtitle" style="color: #89efc8">
                  The $LunarRabbit Token
                </div>
                <div class="text16 contract__text" style="color: #ffffff">
                  The $LunarRabbit Token is the currency of the Lunar Rabbit
                  platforms that can be traded on DEX and CEX once launched,
                  it is designed with unique tokenomics that ensures maximum
                  security for the investor and against sniping bots. The
                  token is built with functions that give less
                  maneuverability to the Dev team, the token will be Audited
                  by a reputable security firm, as community trust and
                  safety is very important to us.
                </div>
              </div>
              <div class="contract__block">
                <div class="contract__subtitle" style="color: #89efc8">
                  AUTO REFLECTION REWARD
                </div>
                <div class="text16 contract__text" style="color: #ffffff">
                  To show appreciation to every community member for their
                  trust and loyalty, there is a 2% fee that is taken upon
                  every buying and selling transaction. This token is then
                  spread to all holders of the token at that particular
                  point in time.
                </div>
              </div>
            </div>
            <a href="https://github.com/freshcoins/Smart-Contract-Audits/blob/main/LunarRabbit_0xCF136913c4583aD8D12190DeA731e6FA75F45E95.pdf"
              class="btn contract__btn" style="padding: 1px">VIEW AUDIT REPORT</a>
          </div>
          <div class="contract__right">
            <div class="contract__img">
              <picture>
                <source srcset="img/app.png" type="image/app" />
                <img src="img/app.png" alt="" style="height: 500px" />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="game">
      <div class="game__row">
        <div class="game-slider">
          <div class="swiper game-slider__container">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <img src="img/images/1.jpg" alt="" />
              </div>
              <div class="swiper-slide">
                <img src="img/images/2.jpg" alt="" />
              </div>
              <div class="swiper-slide">
                <img src="img/images/3.jpg" alt="" />
              </div>
              <div class="swiper-slide">
                <img src="img/images/4.jpg" alt="" />
              </div>
              <div class="swiper-slide">
                <img src="img/images/5.jpg" alt="" />
              </div>
            </div>
          </div>
          <div class="game-slider__arrows">
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div>
        </div>
        <div class="game__content">
          <h3 data-da="game,0,820" class="title game__title" style="color: #89efc8">
            LUNAR RABBIT NFT COLLECTION
          </h3>
          <div class="game__subtitle" style="color: #89efc8">
            Luna Rabbit NFT Collection
          </div>
          <div class="text16 game__text" style="color: #ffffff">
            The Lunar Rabbit NFT is a collection of 2023 pieces of NFT, each
            NFT is designed with different uniqueness and Rarity. The NFTs
            portray the beauty of the Asian women and the attires they don
            during the Lunar Year celebration. Lunar Rabbit community
            members can use these high quality NFT designs PFP images or for
            other uses. To possess any of the NFT images, user has to mint
            it on the Lunar Rabbit DApp that will released on Launch day.
            User can chose to keep the NFT until its value appreciates, then
            sell it. Or a user can chose to stake the NFT and earn
            $LunarRabbit token in return. The Lunar Rabbit NFT is an
            important utility with the Lunar Rabbit ecosystem which will
            give great income to the community members
          </div>
          <a href="https://mint.lunarrabbit.cz" class="btn game__btn">NFT Minter</a>
          <ul class="hero__list game__list">
            <li style="color: #ffffff">
              Passport to access Run-To-Earn Game
            </li>
            <li style="color: #ffffff">Stake to earn reward</li>
            <li style="color: #ffffff">Earn from Game play</li>
          </ul>
        </div>
      </div>
    </section>
    <section class="referral">
      <div class="_container">
        <h3 class="title referral__title" style="color: #89efc8">
          Rabbit Run2Earn Game
        </h3>
        <div class="play__row referral__row">
          <div class="text16 play__text" style="color: #ffffff">
            Do you like games with set tasks and leaderboard? Then this game
            is just for you. It’s a very exciting and addictive game
            designed to give players several means of earning rewards in our
            native token and also earning NFTs.
          </div>
          <div class="text16 play__text" style="color: #ffffff">
            Players need to complete various tasks running with the Rabbit,
            at various levels. The higher the level, the harder the
            difficulty level. With every level completed, reward is made
            available to the player on the game dashboard, which is
            claimable straight into the connected Binance Smart Chain wallet
            or allowed to accumulate. Players are given the chance to
            collect NFTs during gameplay, upon achieving special feats.
            These NFTs can be traded or staked to staking reward.
          </div>
        </div>
        <div class="referral__img">
          <picture>
            <source srcset="img/referral/1.webp" type="image/webp" />
            <img src="img/referral/1.png" alt="" />
          </picture>
        </div>
      </div>
    </section>
    <section class="tokenomics">
      <div class="_container">
        <h3 class="title tokenomics__title" style="color: #89efc8">
          Tokenomics
        </h3>
        <div class="tokenomics__row">
          <div class="tokenomics__left">
            <div class="tokenomics__list tokenomics-list">
              <div class="tokenomics-list__line">
                <div class="tokenomics-list__title" style="color: #ffffff">
                  Name:
                </div>
                <div class="tokenomics-list__null"></div>
                <div class="tokenomics-list__value" style="color: #ffffff">
                  Lunar Rabbit Token
                </div>
              </div>
              <div class="tokenomics-list__line">
                <div class="tokenomics-list__title" style="color: #ffffff">
                  Chain:
                </div>
                <div class="tokenomics-list__null"></div>
                <div class="tokenomics-list__value" style="color: #ffffff">
                  BNB Chain
                </div>
              </div>
              <div class="tokenomics-list__line">
                <div class="tokenomics-list__title" style="color: #ffffff">
                  Symbol:
                </div>
                <div class="tokenomics-list__null"></div>
                <div class="tokenomics-list__value" style="color: #ffffff">
                  $LunarRabbit
                </div>
              </div>
            </div>
            <div class="tokenomics__tax" style="color: #ffffff">
              TAX buy 6% sell 6%
            </div>
            <a href="https://bscscan.com/token/0xcf136913c4583ad8d12190dea731e6fa75f45e95" class="btn tokenomics__btn"
              target="_blank">Contract</a>
          </div>
          <div class="tokenomics__img">
            <picture>
              <source srcset="img/images/chart.png" type="image/png" />
              <img src="img/images/chart.png" alt="" />
            </picture>
          </div>
        </div>
      </div>
    </section>
    <section class="roadmap">
      <h3 class="title roadmap__title" style="color: #89efc8">Road Map</h3>
      <div class="roadmap-slider">
        <div class="swiper roadmap-slider__container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="roadmap-slider__date" style="color: #89efc8">
                PHASE 1
              </div>
              <ul class="hero__list roadmap-slider__list">
                <li style="color: #ffffff">
                  LunarRabbit Whitepaper Release
                </li>
                <li style="color: #ffffff">LunarRabbit Contract Deploy</li>
                <li style="color: #ffffff">Social Platforms creation</li>
                <li style="color: #ffffff">Website Creation</li>
                <li style="color: #ffffff">NFT collection design</li>
                <li style="color: #ffffff">NFT Mint integration</li>
                <li style="color: #ffffff">Contract Audit</li>
                <li style="color: #ffffff">Team KYC</li>
                <li style="color: #ffffff">Marketing Asia and Europe</li>
                <li style="color: #ffffff">Community Development</li>
              </ul>
            </div>

            <div class="swiper-slide">
              <div class="roadmap-slider__date" style="color: #89efc8">
                PHASE 2
              </div>
              <ul class="hero__list roadmap-slider__list">
                <li style="color: #ffffff">Fair Launch on Pinksale</li>
                <li style="color: #ffffff">
                  Pre-Launch Marketing all Regions
                </li>
                <li style="color: #ffffff">Social Media promotion</li>
                <li style="color: #ffffff">Launch on Pancakeswap</li>
                <li style="color: #ffffff">
                  Activate NFT Staking on Mint Dapp
                </li>
                <li style="color: #ffffff">NFT collection Release</li>
                <li style="color: #ffffff">Upvote platforms Listing</li>
                <li style="color: #ffffff">Dextool Trending</li>
                <li style="color: #ffffff">3k Holders Milestone</li>
                <li style="color: #ffffff">
                  CoinGecko & Coinmarketcap listing
                </li>
              </ul>
            </div>
            <div class="swiper-slide">
              <div class="roadmap-slider__date" style="color: #89efc8">
                PHASE 3
              </div>
              <ul class="hero__list roadmap-slider__list">
                <li style="color: #ffffff">5k Holders Milestone</li>
                <li style="color: #ffffff">List on a major CEX</li>
                <li style="color: #ffffff">
                  Billboard & mainstream promotion
                </li>
                <li style="color: #ffffff">Aggressive digital marketing</li>
                <li style="color: #ffffff">
                  Celebrities & Influencer partnership
                </li>
                <li style="color: #ffffff">
                  Weekly AMAs on appropriate platforms
                </li>
              </ul>
            </div>
            <div class="swiper-slide">
              <div class="roadmap-slider__date" style="color: #89efc8">
                PHASE 4
              </div>
              <ul class="hero__list roadmap-slider__list">
                <li style="color: #ffffff">
                  Further Develop and expand our Ecosystem
                </li>
                <li style="color: #ffffff">List on more Major exchanges</li>
                <li style="color: #ffffff">
                  Expand brand awareness and develop use case product - Game
                </li>
                <li style="color: #ffffff">
                  Celebrities & Influencer Shout outs
                </li>
              </ul>
            </div>

            <div class="swiper-slide">
              <div class="roadmap-slider__date" style="color: #89efc8">
                PHASE 5
              </div>
              <ul class="hero__list roadmap-slider__list">
                <li style="color: #ffffff">
                  Continuous development as we progress into the future.
                </li>
              </ul>
            </div>
          </div>
          <div class="swiper-scrollbar"></div>
        </div>
      </div>
    </section>
    <section class="partners">
      <div class="_container">
        <h3 class="title partners__title" style="color: #89efc8">
          Partners
        </h3>
        <div class="partners__row">
          <a href="h#" class="partners__logo" target="_blank">
            <img src="img/logos/1.png" alt="" />
          </a>

          <a href="h#" class="partners__logo" target="_blank">
            <img src="img/logos/2.png" alt="" />
          </a>
          <a href="#" class="partners__logo" target="_blank">
            <img src="img/logos/3.png" alt="" />
          </a>
          <a href="#" class="partners__logo" target="_blank">
            <img src="img/logos/4.png" alt="" />
          </a>
          <a href="#" class="partners__logo" target="_blank">
            <img src="img/logos/5.png" alt="" />
          </a>
          <a href="#" class="partners__logo" target="_blank">
            <img src="img/logos/6.png" alt="" />
          </a>
        </div>
      </div>
    </section>

    <section class="dontmiss">
      <div class="_container">
        <p class="title dontmiss__title" style="color: #89efc8">
          IT'S RABBIT YEAR! 新年快乐!
        </p>
        <a href="#" class="btn dontmiss__btn">Buy LunarRabbit</a>
      </div>
    </section>
  </main>
</template>
