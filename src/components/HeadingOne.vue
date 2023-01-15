<template>
  <header class="header">
    <div class="_container">
      <div class="header__row">
        <a href="/" class="header__logo">
          <img src="img/llogoo.png" alt="" style="height: 130px; width: 150px; margin-top: 35px" />
  
          <!--
  							<br>
  							
  								<img src="ssc.jpg" alt="" style="height: 130px; width: 150px; margin-top: 35px;">
  							-->
        </a>
        <div class="header__menu menu">
          <div class="menu__icon icon-menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <nav class="menu__body">
            <ul class="menu__list">
              <li>
                <a href="#" class="menu__link" data-goto=".play" style="color: #89efc8">Game</a>
              </li>
              <li>
                <a href="/staking" class="menu__link" style="color: #89efc8">Staking</a>
              </li>
              <li>
                <a href="#" class="menu__link" style="color: #89efc8">Utility</a>
              </li>
              <li>
                <a href="#" class="menu__link" data-goto=".game" style="color: #89efc8">NFT</a>
              </li>
              <li>
                <a href="lunarrabitwpp.pdf" class="menu__link" style="color: #89efc8">White Paper</a>
              </li>
              <li>
                <a href="#" class="menu__link" data-goto=".tokenomics" style="color: #89efc8">Tokemonics</a>
              </li>
              <li>
                <a href="#" class="menu__link" data-goto=".roadmap" style="color: #89efc8">Roadmap</a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="header__block">
          <div class="header__lang header-lang">
            <div class="header-lang__btn block-click-toggle" style="color: #89efc8">
              En
            </div>
          </div>
          <div data-da="menu__body,2,480" class="social header__social">
            <a href="https://twitter.com/LunarRabbit2023" class="social__icon social__icon_tw"></a>
            <a href="https://t.me/LunarRabbitChinese" class="social__icon social__icon_tg"></a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>
</style>