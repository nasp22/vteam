import { library } from "@fortawesome/fontawesome-svg-core";
import { faLink, faPowerOff, faUser, faWallet, faClock } from "@fortawesome/free-solid-svg-icons";

function initFontAwesome() {
  library.add(faLink);
  library.add(faUser);
  library.add(faPowerOff);
  library.add(faWallet)
  library.add(faClock)
}

export default initFontAwesome;
