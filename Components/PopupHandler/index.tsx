"use client";

import ConfirmPopup from "@/Components/ConfirmPopup";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closePopup } from "@/redux/reducers/PopUpsReducer";
import { pushToast } from "@/redux/reducers/ToastReducer";

/**
 * Central modal router.
 *
 * Mounted once inside DashboardWrapper, it renders whichever popup
 * `state.popups.active` names, with `subject` carrying the record it acts on.
 * Any module can raise one with a single `openPopup` dispatch — no local state,
 * no prop drilling.
 *
 * Scope note: only globally-triggerable popups belong here. The create/invite
 * modals stay as children of their own module (AddEndUserModal,
 * AddCardholderModal) because they write back into that module's row list, and
 * routing them through here would mean lifting page data into the store for no
 * gain. The reference project draws the same line.
 */
export default function PopupHandler() {
  const dispatch = useAppDispatch();
  const { active, subject } = useAppSelector((state) => state.popups);

  const close = () => dispatch(closePopup());
  const ref = subject ?? "";

  const done = (title: string) =>
    dispatch(pushToast({ tone: "success", title, text: subject ?? undefined }));

  return (
    <>
      <ConfirmPopup
        open={active === "confirmSuspend"}
        title="Suspend this end user?"
        message={`Suspending ${ref} blocks new authorisations immediately. Existing cards stay frozen until the account is reactivated.`}
        confirmLabel="Suspend user"
        danger
        onClose={close}
        onConfirm={() => done("User suspended")}
      />

      <ConfirmPopup
        open={active === "confirmReject"}
        title="Reject this application?"
        message={`${ref} will be notified that verification failed. You can ask them to resubmit documents afterwards.`}
        confirmLabel="Reject application"
        danger
        onClose={close}
        onConfirm={() => done("Application rejected")}
      />

      <ConfirmPopup
        open={active === "confirmRevoke"}
        title="Revoke this API key?"
        message={`${ref} stops working immediately. Any integration still using it will receive 401 responses.`}
        confirmLabel="Revoke key"
        danger
        onClose={close}
        onConfirm={() => done("Key revoked")}
      />
    </>
  );
}
