import { library } from "@fortawesome/fontawesome-svg-core";
import { faLink, faPowerOff, faUser, faWallet, faClock, faMap, faParking, faPlay, faExternalLinkSquareAlt} from "@fortawesome/free-solid-svg-icons";

function initFontAwesome() {
  library.add(faLink);
  library.add(faUser);
  library.add(faPowerOff);
  library.add(faWallet)
  library.add(faClock)
  library.add(faMap)
  library.add(faParking)
  library.add(faPlay)
  library.add(faExternalLinkSquareAlt)
}

export default initFontAwesome;
