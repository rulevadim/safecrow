<template>
  <footer class="page-footer">
    <div class="container page-footer__container">
      <div class="page-footer__block">
        <div class="page-footer__title">Телефон поддержки</div>
        <ul class="page-footer__list">
          <li class="page-footer__item page-footer__item_phone">
            <div class="page-footer__icon-wrapper">
              <icon-base icon-name="phone" :width="24" :height="24" view-box="0 0 24 24">
                <icon-phone />
              </icon-base>
            </div>
            <a class="page-footer__link" href="tel:88007075531">
              8 (800) 707-55-31
            </a>
          </li>
          <li class="page-footer__item page-footer__item_phone_no-icon">
            <a class="page-footer__link" href="tel:+74993222475">
              +7 (499) 322-24-75
            </a>
          </li>
        </ul>
      </div>
      <div class="page-footer__block">
        <div class="page-footer__title">Контактные данные</div>
        <ul class="page-footer__list">
          <li class="page-footer__item">
            <div class="page-footer__icon-wrapper">
              <icon-base icon-name="mail" :width="24" :height="24" view-box="0 0 24 24">
                <icon-mail />
              </icon-base>
            </div>
            <a class="page-footer__link page-footer__link_active page-footer__link_color" :href="mailLink">
              contact@safecrow.ru
            </a>
          </li>
          <li class="page-footer__item">
            <div class="page-footer__icon-wrapper">
              <icon-base icon-name="location" :width="24" :height="24" view-box="0 0 24 24">
                <icon-location />
              </icon-base>
            </div>
            <a
              class="page-footer__link"
              target="_blank"
              href="https://www.google.com/maps/place/Краснопресненская+наб.,+12+корпус+1,+Москва,+123100/"
            >
              123610,&nbsp;Москва, Краснопресненская&nbsp;наб., дом&nbsp;12,&nbsp;стр.1
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="page-footer__foot">
      &copy;&nbsp;2019&nbsp;&mdash;&nbsp;{{ yearFooter }} Сервис разработан ООО&nbsp;&laquo;Сэйфкроу&raquo;
      <span v-if="!isPartnerAlfabank"
        >по&nbsp;заказу <a class="page-footer__foot-link" :href="partnerData.linkURL">{{ partnerData.name }}</a></span
      >
    </div>
  </footer>
</template>

<script src="./page-footer.ts" lang="ts"></script>
<style src="./page-footer.css"></style>
