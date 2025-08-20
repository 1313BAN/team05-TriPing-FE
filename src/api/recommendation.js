// import api from './index'

export const fetchRecommendedAttractions = async (lat, lng) => {
  try {
    // 더미 데이터로 대체
    const dummyData = [
      {
        "id": 56797,
        "title": "덕수궁",
        "address": "서울특별시 중구 세종대로 99",
        "reason": "조선왕조의 마지막 궁궐로, 서양식과 한국 전통 건축이 조화를 이루는 독특한 매력을 가진 곳입니다",
        "score": 95,
        "latitude": 37.56614867140000000,
        "longitude": 126.97492969050000000,
        "imageUrl": "http://tong.visitkorea.or.kr/cms/resource/05/3092905_image2_1.jpg"
      },
      {
        "id": 56664,
        "title": "경복궁",
        "address": "서울특별시 종로구 사직로 161",
        "reason": "조선왕조 제일의 법궁으로, 웅장한 규모와 아름다운 전각들이 한국의 전통 건축미를 보여주는 대표적인 궁궐입니다",
        "score": 88,
        "latitude": 37.57882223560000000,
        "longitude": 126.97699303250000000,
        "imageUrl": "http://tong.visitkorea.or.kr/cms/resource/33/2678633_image2_1.jpg"
      },
      {
        "id": 56703,
        "title": "광화문광장",
        "address": "서울특별시 종로구 세종대로 172",
        "reason": "한국 역사의 중심지로, 세종대왕과 이순신 동상이 있으며 다양한 문화행사가 열리는 서울의 대표 광장입니다",
        "score": 82,
        "latitude": 37.57270350210000000,
        "longitude": 126.97697098610000000,
        "imageUrl": "http://tong.visitkorea.or.kr/cms/resource/24/3083624_image2_1.JPG"
      }
    ]

    // API 호출을 시뮬레이션하기 위한 딜레이
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('✅ 추천 결과 (더미 데이터):', dummyData)
    return dummyData
  } catch (err) {
    console.error('❌ 추천 처리 실패:', err.message)
    return []
  }
}
  