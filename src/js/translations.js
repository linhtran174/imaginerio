const translations = [
  {
    name: 'jump-to-era',
    selector: '.era-dropdown-text',
    en: 'Jump to era... ',
    vn: 'Đi đến thời... ',
  },
  {
    name: 'h1',
    selector: 'h1',
    en: 'Old TayHo',
    vn: 'Tây Hồ Xưa',
  },
  {
    name: 'disclaimer-text',
    selector: '.disclaimer-text',
    en: '',
    vn: '',
  },
  {
    name: 'era-description',
    selector: '.era-description',
    en: 'Old TayHo is a searchable digital atlas that illustrates the social and urban evolution of the old TayHo, as it existed and as it was imagined. Views, historical  maps, and ground floor plans – from iconographic, cartographic, and architectural archives – are located in both time and space while their visual and spatial data are integrated across a number of databases and servers, including a public repository of images, a geographic information system, an open-source relational database, and a content delivery web system. The relationship between the various project elements produces a web environment where vector, spatial, and raster data are simultaneously probed, toggled, viewed, and/or queried in a system that supports multiple expressions of diverse data sources. It is an environment where, for example, historians can visualize specific sites both temporally and spatially, where architects and urbanists can see proposed design projects in situ, where literary scholars can map out novels while visualizing their contexts, and where archaeologists can reconstruct complex stratigraphies. Scaled down into a mobile version, the site allows tourists and residents to walk about town while visualizing the city as it once was as well as it was once projected. TayHo\'s urban history is particularly well suited to being captured diachronically considering how much the city\'s natural environment, urban fabric, and self-representation have changed over time. To make TayHo what it is today, hills were leveled, swamps drained, shorelines redrawn, and islands joined to the mainland. Such a changing physical and social landscape, with all its political consequences, lends itself to being spatially contextualized in a digital platform that illustrates the change of time.',
    vn: 'Tây Hồ Xưa là một bản đồ tương tác giúp minh họa sự phát triển theo thời gian của Tây Hồ từ những năm 1858, như thế nó vẫn còn tồn tại và hiện ra ngay trước mắt chúng ta. Những góc nhìn qua ảnh chụp, bản đồ lịch sử , các bản quy hoạch - được thu thập từ nhiều kho tàng kiến trúc và địa đồ - tất cả chúng nó được phơi bày theo trình tự không gian và thời gian. Đây là một môi trường lý tưởng cho những nhà sử học muốn hình dung một chốn cũ đã chuyển mình ra sao, cho những kiến trúc sư hay những nhà quy hoạch đô thị nhìn được nguyên trạng những bản thiết kế đã được đệ trình, cho những người học văn liên hệ thực tế đến những thứ được vẽ ra trong những tác phẩm văn học, và cho những nhà khảo cổ có thể tái hiện lại những địa tầng phức tạp. Tây Hồ Xưa cũng có 1 phiên bản cho di động, giúp cho khách du lịch và cư dân địa phương có một trải nghiệm tuyệt vời - vừa đi bộ vừa khám phá và tưởng tượng như khu Tây Hồ sống lại thời xưa. Khu vực Tây Hồ với cái lịch sử thăng trầm của nó thực sự chỉ có thể được biểu diễn tốt nhất khi ta cho tất cả những mảnh ghép lại trong một không thời gian thống nhất, những mảnh ghép của cảnh quan thiên nhiên, đô thị và những đặc trưng địa phương khác. Để có được một khu Tây Hồ như bây giờ, sông đã phải đổi, núi đã phải dời, thậm chỉ còn có thể có máu đổ. Cụ thể như thế nào thì không rõ, nhưng với tất cả những trang sử rực rỡ cả về mặt địa lý, chính trị và xã hội như vậy thì Tây Hồ cần phải được khám phá qua một cái nền tảng thông tin điện tử như thế này.'
  },
  {
    name: 'legend-title-text',
    selector: '.legend-title-text',
    en: 'Map Legend',
    vn: 'Map Legend',
  },
  {
    name: 'explore-map-button-text',
    selector: '.explore-map-button-text',
    en: 'Begin Exploring',
    vn: 'Bắt đầu khám phá!',
  },
  {
    name: 'go-to-map',
    en: 'Go to Map',
    vn: 'Đến bản đồ ',
  },
  {
    name: 'back-to-text',
    selector: '.back-to-text',
    en: 'Back to ',
    vn: 'Quay lại ',
  },
  {
    name: 'start',
    en: 'start',
    vn: 'trang chủ',
  },
  {
    name: 'click-for-details',
    en: 'Click for details',
    vn: 'Ấn để biết thêm chi tiết',
  },
  {
    name: 'probe-hint-text',
    selector: '.probe-hint-text',
    en: 'Click the map to explore, or',
    vn: 'Ấn vào bản đồ để khám phá, hoặc',
  },
  {
    name: 'probe-area-text',
    selector: '.probe-area-text',
    en: 'Explore by area ',
    vn: 'Khám phá theo vùng ',
  },
  {
    name: 'probe-hint-text--mobile',
    selector: '.probe-hint-text--mobile',
    en: 'Tap the map to explore...',
    vn: 'Ấn vào bản đồ để khám phá...',
  },
  {
    name: 'plans',
    en: 'Urban Projects',
    vn: 'Các dự án đô thị',
  },
  {
    name: 'search-map-layers',
    selector: '.search-map-layers-text',
    en: 'Search map layers...',
    vn: 'Tìm kiếm ảnh, địa điểm v.v...',
  },
];

const eraTranslations = [
  {
    name: '1858-1945',
    en: 'French Colonial Era',
    vn: 'Thời kỳ Pháp thuộc',
  },
  {
    name: '1945-1976',
    en: 'Warring Era',
    vn: 'Thời kỳ chiến tranh',
  },
  {
    name: '1976-1986',
    en: 'Unified Era',
    vn: 'Thời mới thống nhất',
  },
  {
    name: `1986-${new Date().getFullYear()}`,
    en: 'Renovated Era',
    vn: 'Thời kỳ xây dựng đất nước',
  }
];

const planCredits = [
  {
    name: 'Beaurepaire-Rohan 1840-1843',
    en: 'Interpreted by Verena Andreatta',
    vn: 'Interpretado por Verena Andreatta',
  },
  {
    name: 'Comissão de Melhoramentos 1875-1876',
    en: 'Interpreted by Verena Andreatta',
    vn: 'Interpretado por Verena Andreatta',
  },
  {
    name: 'Pereira Passos 1903-1906',
    en: 'Interpreted by Verena Andreatta',
    vn: 'Interpretado por Verena Andreatta',
  },
  {
    name: 'Le Corbusier',
    en: 'Interpreted by Farès el-Dahdah',
    vn: 'Interpretado por Farès el-Dahdah',
  },
];

export default [...translations, ...eraTranslations, ...planCredits];
