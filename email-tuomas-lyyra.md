Hei Tuomas,

Juttelimme jonkin aikaa sitten Jälkimaku-sivuston lanseerauksesta ja siitä, että meidän täytyy tehdä yhteistyötä, jotta saamme projektin lanseerattua syksyllä talvirengaskauden alkaessa.

Alla ehdotus siitä, miten Rengas Centerin sivustot (rengascenterilola.fi ja klaukkalanrengas.fi) liitetään Jälkimakuun. Jotta yhteistyö saadaan toimimaan, seuraavat asiat pitää olla kunnossa:

**Toiminnallinen vaatimus**
- Kun asiakas ostaa ja maksaa täyden sarjan (4 kpl) uusia renkaita, teidän järjestelmänne lähettää siitä ilmoituksen Jälkimakulle — Jälkimaku luo tämän perusteella automaattisesti kupongin.
- Suodatus tapahtuu teidän päässänne: Jälkimaku ei näe tilausrivejä, vaan ainoastaan sen mitä te lähetätte.

**Tekninen toteutus**
- Ilmoitus lähetetään palvelimelta palvelimelle (esim. Odoosta), ei koskaan selaimesta — jaettu salasana ei saa koskaan näkyä asiakkaan selaimessa.
- Osoite: `POST https://jalkimaku.fi/api/webhook/order`
- Otsikossa `x-webhook-secret`, jonka toimitamme erikseen sovitulla tavalla.

**Lähetettävät tiedot**
- `order_number` — pakollinen, yksilöllinen tilausnumero (toimii myös kaksoiskappaleiden estona)
- `reg_plate` — pakollinen, rekisterinumero
- `partner_id` — valinnainen, Odoon partner id jos saatavilla
- `email` — valinnainen, mutta suositeltu: jos tämä lähetetään, Jälkimaku lähettää asiakkaalle automaattisesti sähköpostin heti kun kuponki on luotu (koodi, voimassaoloaika ja linkki kupongin aktivointiin). Ilman sähköpostiosoitetta asiakas löytää kuponkinsa edelleen jalkimaku.fi-sivulta rekisterinumerolla.
- `customer_name` — valinnainen, käytetään vain sähköpostin tervehdykseen ("Hei Matti,")

**Luotettavuus**
- Kutsu on turvallinen toistaa: jos yhteys katkeaa tai vastaus ei tule perille, saman `order_number`:n uudelleenlähetys ei luo toista kuponkia.

**Avoimet kysymykset, jotka pitää sopia ennen lanseerausta**
- **Minimihinta:** Onko tilaukselle asetettava minimihinta, vai laukaiseeko mikä tahansa neljän uuden renkaan täysi sarja kupongin hinnasta riippumatta? Tämä pitää päättää ja toteuttaa teidän päässänne, koska Jälkimaku ei näe tilauksen hintatietoja.
- **Myymälän tunnistus:** Halutaanko jatkossa raportoinnissa erotella, kummasta sivustosta (rengascenterilola.fi vai klaukkalanrengas.fi) tilaus tuli? Tämä on helppo lisätä, mutta pitää päättää etukäteen.

Jos tämä vaikuttaa teidän puoleltanne toteutuskelpoiselta, voisimme sopia tekniset yksityiskohdat (mm. salasanan toimitus) niin, että integraatio on testattu ja valmiina hyvissä ajoin ennen syksyn talvirengaskautta.

Terveisin,
Anton
