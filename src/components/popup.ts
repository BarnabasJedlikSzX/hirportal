import { Modal } from 'bootstrap';
import type { PopupTexts } from '../types/Popup';
import { showSuccess } from './user_validations';


/**
 * Dinamikus Bootstrap megerősítő ablak.
 * True-val tér vissza ha az Igen-re, False-al ha a Mégse gombra kattintottak.
 */
export function showConfirm(options: PopupTexts): Promise<boolean> {
  return new Promise((resolve) => {
    // 1. HTML Szerkezet létrehozása dinamikusan
    const modalWrapper = document.createElement('div');
    modalWrapper.innerHTML = `
      <div class="modal fade" id="tsConfirmModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${options.title || 'Megerősítés'}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" id="tsModalCloseX"></button>
            </div>
            <div class="modal-body">
              <p>${options.message}</p>
            </div>
            ${options.cancelText != undefined && options.confirmText != undefined ?

                `<div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="tsModalCancelBtn">${options.cancelText || 'Mégse'}</button>
                  <button type="button" class="btn btn-danger" id="tsModalConfirmBtn">${options.confirmText || 'Igen'}</button>
                </div>`
                :
                ""

            }
          </div>
        </div>
      </div>
    `.trim();

    const modalElement = modalWrapper.firstChild as HTMLElement;
    document.body.appendChild(modalElement);

    // 2. A Bootstrap Modal osztály példányosítása
    const bootstrapModal = new Modal(modalElement, {
      backdrop: 'static',
      keyboard: false
    });

    let wasConfirmed = false;

    // 3. Eseménykezelő az "Igen" gombra
    const confirmBtn = modalElement.querySelector('#tsModalConfirmBtn') as HTMLButtonElement;
    if(confirmBtn){
      confirmBtn.addEventListener('click', () => {
          wasConfirmed = true;
          bootstrapModal.hide(); // Ez ki fogja váltani a rejtett (hidden) eseményt
      }, {once: true});
    }
    
    // 4. Takarítás és a Promise lezárása (BÁRMELYIK bezárás gombra lefut)
    modalElement.addEventListener('hidden.bs.modal', () => {
        bootstrapModal.dispose(); // Bootstrap memória felszabadítása
        modalElement.remove();    // HTML eltávolítása a DOM-ból
        resolve(wasConfirmed);    // Visszaadjuk az eredményt (true vagy false)
    });
    
    // 5. Megjelenítés
    bootstrapModal.show();
  });
}

export async function  showPopup(options: PopupTexts): Promise<boolean> {
  return new Promise(async (resolve) => {
    // 1. HTML Szerkezet létrehozása dinamikusan
    const modalWrapper = document.createElement('div');
    modalWrapper.innerHTML = `
      <div class="modal fade" id="tsConfirmModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${options.title || 'Megerősítés'}</h5>
              
            </div>
            ${options.message == undefined ? ""
              : `
              <div class="modal-body">
                ${options.message}
              </div>
              
              `
            }
            
          </div>
        </div>
      </div>
    `.trim();

    const modalElement = modalWrapper.firstChild as HTMLElement;
    document.body.appendChild(modalElement);

    // 2. A Bootstrap Modal osztály példányosítása
    const bootstrapModal = new Modal(modalElement, {
      backdrop: 'static',
      keyboard: false
    });

    
    // 4. Takarítás és a Promise lezárása (BÁRMELYIK bezárás gombra lefut)
    
    modalElement.addEventListener('shown.bs.modal', async () => {
        await showSuccess(options.duration!)
        bootstrapModal.hide();
    });


    resolve(true);    // Visszaadjuk az eredményt (true vagy false)
    // 5. Megjelenítés
    console.log("fasz")
    bootstrapModal.show();
  });
}