/**
 * 퀸즈테이블 사이트 공통 설정
 * ⚠️ addressDistrict(남구/북구)는 최종 확인 전까지 '남구' 유지.
 *    변경 시 이 파일의 addressDistrict 값만 수정하면 data-qt 바인딩 요소에 반영됩니다.
 */
const QT_SITE = {
  addressDistrict: '남구',
  streetAddress: '대이로 18',
  floor: '3층',
  phone: '054-281-4000',
  phoneTel: 'tel:054-281-4000',
  reservationChannels: '캐치테이블 · 네이버 예약 가능',
  naverBookingUrl: 'https://map.naver.com/p/entry/place/2015597853?placePath=/ticket',
  naverPlaceUrl: 'https://naver.me/5xajUCDf',
  reservationNote: '100% 예약제 운영 · 방문 전 전화 예약 필수',
  get fullAddress() {
    return `경북 포항시 ${this.addressDistrict} ${this.streetAddress}, ${this.floor}`;
  },
  get streetAddressForSchema() {
    return `${this.addressDistrict} ${this.streetAddress} ${this.floor}`;
  },
};

(function applyQtSiteConfig() {
  function bind() {
    const s = QT_SITE;

    document.querySelectorAll('[data-qt="full-address"]').forEach((el) => {
      el.textContent = s.fullAddress;
    });

    document.querySelectorAll('[data-qt="phone"]').forEach((el) => {
      el.textContent = s.phone;
    });

    document.querySelectorAll('[data-qt="phone-link"]').forEach((el) => {
      el.href = s.phoneTel;
      el.textContent = s.phone;
    });

    document.querySelectorAll('[data-qt="channels"]').forEach((el) => {
      el.textContent = s.reservationChannels;
    });

    document.querySelectorAll('[data-qt="reservation-note"]').forEach((el) => {
      el.textContent = s.reservationNote;
    });

    document.querySelectorAll('[data-qt="cta-buffet"], [data-qt="cta-catering"]').forEach((el) => {
      el.href = s.phoneTel;
    });

    const restaurantLd = document.getElementById('qt-restaurant-ldjson');
    if (restaurantLd) {
      try {
        const data = JSON.parse(restaurantLd.textContent);
        data.telephone = `+82-${s.phone.replace(/^0/, '')}`;
        data.address.streetAddress = s.streetAddressForSchema;
        restaurantLd.textContent = JSON.stringify(data, null, 2);
      } catch (_) { /* ignore */ }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
