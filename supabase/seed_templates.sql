-- ==============================================================================
-- Seed Curated Templates for Apple Beauty Salon (30 Templates across 3 Languages)
-- ==============================================================================

WITH salon_biz AS (SELECT id FROM public.businesses WHERE slug = 'apple-beauty-salon')
INSERT INTO public.review_templates (business_id, language, opening_sentence, template_text, content_hash, status)
SELECT 
    salon_biz.id,
    t.lang,
    t.opening,
    t.body,
    encode(digest(t.body, 'sha256'), 'hex'),
    'available'
FROM salon_biz,
(VALUES
  -- English
  ('en', 'The haircut consultation was detailed and took my face shape into account.', 'The haircut consultation was detailed and took my face shape into account. The stylist listened carefully to how I like to manage my daily hair styling. The salon at Radhe Signature in Kudasan has a calm, pleasant environment.'),
  ('en', 'Stepping into Apple Beauty Salon provided a soothing break from a busy weekday.', 'Stepping into Apple Beauty Salon provided a soothing break from a busy weekday. My facial treatment was done with great gentleness and attention to skin hygiene. The staff maintained clean towels and hygienic products throughout the session. Appreciated the serene ambiance here in Kudasan.'),
  ('en', 'Eyebrow shaping was finished with impressive precision and minimal discomfort.', 'Eyebrow shaping was finished with impressive precision and minimal discomfort. Very hygienic technique and gentle hands make this salon a reliable choice in Gandhinagar.'),
  ('en', 'Using Italian Rica wax made the hair removal process noticeably gentler on my sensitive skin.', 'Using Italian Rica wax made the hair removal process noticeably gentler on my sensitive skin. The aesthetician worked efficiently and ensured everything remained neat and comfortable. Radhe Signature location is convenient with easy parking.'),
  ('en', 'Thorough hand and foot care made the spa pedicure session thoroughly rejuvenating.', 'Thorough hand and foot care made the spa pedicure session thoroughly rejuvenating. The warm soak, gentle scrub, and neat cuticle detailing were handled with unhurried care. Clean tools and warm hospitality stand out at Apple Beauty Salon.'),
  ('en', 'Deep scalp massage during the hair spa helped ease a lot of accumulated work tension.', 'Deep scalp massage during the hair spa helped ease a lot of accumulated work tension. The steam therapy and nourishing mask left my hair feeling significantly softer and manageable. A great self-care ritual in Kudasan.'),
  ('en', 'A prompt skin cleanup left my face feeling thoroughly refreshed and breathing easy.', 'A prompt skin cleanup left my face feeling thoroughly refreshed and breathing easy. Clean setup, polite staff, and punctual service right on time.'),
  ('en', 'Precision nail shaping and clean cuticle care were done with meticulous patience.', 'Precision nail shaping and clean cuticle care were done with meticulous patience. The polish application was smooth, even, and long-lasting. Always a dependable grooming studio in Kudasan, Gandhinagar.'),
  ('en', 'Pre-wedding beauty preparation was coordinated seamlessly across multiple appointments.', 'Pre-wedding beauty preparation was coordinated seamlessly across multiple appointments. From customized skincare therapies to final makeup consultation, the team showed true professional dedication. Their experience since 1996 clearly reflects in their calm handling of busy brides.'),
  ('en', 'Festive styling and saree draping for our family function were completed right on schedule.', 'Festive styling and saree draping for our family function were completed right on schedule. The hairstyle held beautifully throughout the event and the staff accommodated our timing smoothly. Highly recommended in Kudasan.'),

  -- Gujarati
  ('gu', 'હેરકટ વખતે મારી પસંદગી સમજીને ખૂબ જ સરસ રીતે કટિંગ કરી આપ્યું.', 'હેરકટ વખતે મારી પસંદગી સમજીને ખૂબ જ સરસ રીતે કટિંગ કરી આપ્યું. કુડાસણના રાધે સિગ્નેચરમાં આવેલું એપલ બ્યુટી સલૂન ખૂબ જ સ્વચ્છ અને શાંત વાતાવરણ પૂરું પાડે છે. સ્ટાફનો વ્યવહાર ખૂબ નમ્ર છે.'),
  ('gu', 'ફેસિયલ ટ્રીટમેન્ટ દરમિયાન સ્કીનની કાળજી અને સ્વચ્છતાનું ખૂબ ધ્યાન રાખવામાં આવ્યું.', 'ફેસિયલ ટ્રીટમેન્ટ દરમિયાન સ્કીનની કાળજી અને સ્વચ્છતાનું ખૂબ ધ્યાન રાખવામાં આવ્યું. હળવો મસાજ અને સ્ટીમથી ચહેરા પર તાજગી અનુભવાઈ. ગાંધીનગરમાં મહિલાઓ માટે આ એક વિશ્વાસપાત્ર અને આરામદાયક બ્યુટી સલૂન છે.'),
  ('gu', 'આઈબ્રો થ્રેડિંગ ખૂબ જ ચોકસાઈપૂર્વક અને હળવા હાથે કરી આપ્યું.', 'આઈબ્રો થ્રેડિંગ ખૂબ જ ચોકસાઈપૂર્વક અને હળવા હાથે કરી આપ્યું. સ્વચ્છતા અને સારો વ્યવહાર અહીંની ખાસિયત છે.'),
  ('gu', 'રીકા વેક્સિંગથી ત્વચા પર કોઈ પણ પ્રકારની બળતરા વગર સરસ અનુભવ રહ્યો.', 'રીકા વેક્સિંગથી ત્વચા પર કોઈ પણ પ્રકારની બળતરા વગર સરસ અનુભવ રહ્યો. સંવેદનશીલ સ્કિન માટે આ વેક્સ ખૂબ જ ઉત્તમ છે. સ્ટાફે પૂરતી સ્વચ્છતા રાખીને આખી પ્રક્રિયા પૂરી કરી.'),
  ('gu', 'પેડીક્યોર અને મેનીક્યોર સેશનથી હાથ-પગને ખૂબ આરામ અને સ્વચ્છતા મળી.', 'પેડીક્યોર અને મેનીક્યોર સેશનથી હાથ-પગને ખૂબ આરામ અને સ્વચ્છતા મળી. નખની યોગ્ય કાળજી અને હળવો સ્ક્રબ-મસાજ ખૂબ ગમ્યો. ૧૯૯૬ થી ચાલી આવતો આ સલૂનનો અનુભવ સ્પષ્ટ દેખાય છે.'),
  ('gu', 'હેર સ્પા બાદ વાળમાં કુદરતી ચમક અને નરમાશ આવી ગઈ.', 'હેર સ્પા બાદ વાળમાં કુદરતી ચમક અને નરમાશ આવી ગઈ. માથાનો મસાજ ખૂબ જ શાંતિ આપનારો હતો. કુડાસણમાં વાળની સંભાળ માટે સરસ જગ્યા છે.'),
  ('gu', 'ઝડપી સ્કીન ક્લીન-અપથી ત્વચા એકદમ તાજી અને સાફ બની ગઈ.', 'ઝડપી સ્કીન ક્લીન-અપથી ત્વચા એકદમ તાજી અને સાફ બની ગઈ. સમયસર સેવા અને ચોખ્ખાઈથી સંપૂર્ણ સંતોષ થયો.'),
  ('gu', 'નેઇલ આર્ટ અને શેપિંગ ખૂબ જ સુંદર અને કુનેહપૂર્વક કરવામાં આવ્યું.', 'નેઇલ આર્ટ અને શેપિંગ ખૂબ જ સુંદર અને કુનેહપૂર્વક કરવામાં આવ્યું. કલર પસંદગી અને ફિનિશિંગ બંને ઉત્તમ રહ્યા.'),
  ('gu', 'લગ્ન પ્રસંગની તૈયારીઓ માટે એપલ બ્યુટી સલૂન તરફથી શ્રેષ્ઠ સેવા મળી.', 'લગ્ન પ્રસંગની તૈયારીઓ માટે એપલ બ્યુટી સલૂન તરફથી શ્રેષ્ઠ સેવા મળી. પ્રી-બ્રાઇડલ કેરથી લઈને મેકઅપ સુધીની દરેક વિગતનું સુંદર ધ્યાન રખાયું હતું. ગાંધીનગરમાં દુલ્હનો માટે વિશ્વસનીય સ્થાન છે.'),
  ('gu', 'ફેમિલી ફંક્શન માટે સાડી ડ્રેપિંગ અને હેરસ્ટાઇલ સમયસર તૈયાર કરી આપ્યા.', 'ફેમિલી ફંક્શન માટે સાડી ડ્રેપિંગ અને હેરસ્ટાઇલ સમયસર તૈયાર કરી આપ્યા. બધા મહેમાનોને અમારો લુક ખૂબ ગમ્યો. સ્ટાફનો સહયોગ ખૂબ સારો રહ્યો.'),

  -- Hindi
  ('hi', 'हेयरकट और स्टाइलिंग मेरी पसंद के अनुसार बहुत ही कुशलता से की गई।', 'हेयरकट और स्टाइलिंग मेरी पसंद के अनुसार बहुत ही कुशलता से की गई। कुड़ासन के राधे सिग्नेचर स्थित Apple Beauty Salon का माहौल काफी शांत और साफ-सुथरा है। स्टाफ का व्यवहार बहुत सम्मानजनक रहा।'),
  ('hi', 'फेशियल सेशन के दौरान स्किन की सफाई और हाइजीन का पूरा ध्यान रखा गया।', 'फेशियल सेशन के दौरान स्किन की सफाई और हाइजीन का पूरा ध्यान रखा गया। सौम्य मसाज और स्टीम से चेहरे पर बेहतरीन निखार और ताजगी महसूस हुई। गांधीनगर में सेल्फ-केयर के लिए यह एक बहुत ही आरामदायक सलोन है।'),
  ('hi', 'आईब्रो थ्रेडिंग बहुत ही बारीकी और बिना किसी दर्द के पूरी की गई।', 'आईब्रो थ्रेडिंग बहुत ही बारीकी और बिना किसी दर्द के पूरी की गई। हाइजीनिक तरीका और अनुभवी हाथ यहां की खासियत हैं।'),
  ('hi', 'रीका वैक्सिंग से संवेदनशील त्वचा पर भी कोई जलन नहीं हुई और बहुत स्मूद रिजल्ट मिला।', 'रीका वैक्सिंग से संवेदनशील त्वचा पर भी कोई जलन नहीं हुई और बहुत स्मूद रिजल्ट मिला। काम बहुत तेजी और सफाई से पूरा किया गया। कुड़ासन में यह एक भरोसेमंद जगह है।'),
  ('hi', 'पेडिक्योर और मेनिक्योर के बाद हाथ और पैरों में बहुत हल्कापन और ताजगी महसूस हुई।', 'पेडिक्योर और मेनिक्योर के बाद हाथ और पैरों में बहुत हल्कापन और ताजगी महसूस हुई। गुनगुने पानी का सोक, स्क्रब और क्यूटिकल केयर पूरी तसल्ली से की गई। 1996 से कार्यरत इस सलोन का अनुभव साफ नजर आता है।'),
  ('hi', 'हेयर स्पा के हेड मसाज से पूरे हफ्ते की थकान और तनाव दूर हो गया।', 'हेयर स्पा के हेड मसाज से पूरे हफ्ते की थकान और तनाव दूर हो गया। डीप कंडीशनिंग और स्टीम से बाल काफी मुलायम और रेशमी हो गए। गांधीनगर में हेयर केयर के लिए उत्तम विकल्प।'),
  ('hi', 'त्वरित स्किन क्लीन-अप से चेहरे की चमक और ताजगी लौट आई।', 'त्वरित स्किन क्लीन-अप से चेहरे की चमक और ताजगी लौट आई। साफ वातावरण और समय की पाबंदी से बेहद संतुष्टि मिली।'),
  ('hi', 'नाखूनों की शेप और नेल पेंट एप्लीकेशन बहुत ही फिनिशिंग के साथ की गई।', 'नाखूनों की शेप और नेल पेंट एप्लीकेशन बहुत ही फिनिशिंग के साथ की गई। कलर शेड्स और सर्विस दोनों ही बढ़िया रहे।'),
  ('hi', 'शादी के समारोह के लिए ब्राइडल ब्यूटी पैकेज की सेवाएं बहुत ही उच्च स्तरीय रहीं।', 'शादी के समारोह के लिए ब्राइडल ब्यूटी पैकेज की सेवाएं बहुत ही उच्च स्तरीय रहीं। प्री-ब्राइडल स्किनकेयर से लेकर मेकअप और हेयरडू तक सब कुछ समयबद्ध और खूबसूरत रहा। दुल्हन के लिए कुड़ासन में सबसे बेहतरीन सलोन।'),
  ('hi', 'पारिवारिक शादी के लिए साड़ी ड्रेपिंग और हेयर स्टाइल बिल्कुल समय पर तैयार किया गया।', 'पारिवारिक शादी के लिए साड़ी ड्रेपिंग और हेयर स्टाइल बिल्कुल समय पर तैयार किया गया। फंक्शन खत्म होने तक हेयर स्टाइल बिल्कुल सेट रहा। पूरे परिवार को सर्विस बहुत पसंद आई।')
) AS t(lang, opening, body)
ON CONFLICT (business_id, content_hash) DO NOTHING;
