# Kalkulators
## "Yet Another Useless Calculator"
Kalkulatora projekts pirkstu vingrināšanai
## [Demo](https://portfolio.folkmanis.id.lv/calculator/)
### Izpēte
Kalkulatora definīcija ir sipri nenoteikta. Katrs ražotājs ir taisījis pa savam.
- Funkcionalitāte neskaidra.
  - Vai ņemt vērā darbību kārtību?
  - Infix, prefix vai postfix pieraksts?
- Toties varu taisīt pa savam.
- Katras nākamās darbības rezultāts ir atkarīgs no iepriekšējās, un neveido likumsakarību. Sanāca diezgan sarežģīta uzvedības matrica. 
  ### Izdarīts
- Pogas strādā, reaģē gan uz peles klikšķiem, gan klaviatūru.
- Rēķina, ņemot vērā darbību secību un iekavas.
- Operatori infix pierakstā, funkcijas - prefix.
- Var viegli papildināt ar jebkurām vienargumenta funkcijām un operatoriem.
- Undo atceļ iepriekšējo ievadi līdz Reset.
### Izmantots
- React diezgan primitīvā veidā, agrāk neesmu ar to saskāries.
- [Tailwind](https://tailwindcss.com/) - tāpat
- [Typescript](https://www.typescriptlang.org/)
- [parcel](https://github.com/parcel-bundler/parcel#readme)
- [immer](https://github.com/immerjs/immer#readme)
- [html-react-parser](https://github.com/remarkablemark/html-react-parser#readme)
### Palika neizdarīts
- Lai gan `any` nav izmantots, bet `!` ir pāris vietās, tomēr ar dažiem TypeScript tipiem netiku galā.
- Vajadzētu nedaudz satīrīt. ESlint.
- Jāraksta testi. Vismaz matemātikai. Pāris kļūdas izķēru, bet jābūt vēl.
