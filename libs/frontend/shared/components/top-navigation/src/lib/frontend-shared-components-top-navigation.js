
import TopNavigation from "@cloudscape-design/components/top-navigation";
import { getImagePath } from '@visionarea-admin/frontend/shared/function';
import { useMe } from "@visionarea-admin/frontend/authentication";

export const FrontendSharedComponentsTopNavigation = () => {
  const { me } = useMe();
  return (
    <TopNavigation
      identity={{
        href: "/",
        title: "",
        logo: {
          src: getImagePath('logo_menu.png'),
          alt: "Visionarea Fireworks"
        }
      }}
      utilities={[
        {
          type: "button",
          iconName: "notification",
          title: "Notifications",
          ariaLabel: "Notifications (unread)",
          badge: true,
          disableUtilityCollapse: false
        },
        {
          type: "menu-dropdown",
          text: me.UserNickName,
          description: me.UserEMail,
          iconName: "user-profile",
          items: [
            { id: "signout", text: "Logout", href: "/logout" }
          ]
        }
      ]}
      i18nStrings={{
        searchIconAriaLabel: "Search",
        searchDismissIconAriaLabel: "Close search",
        overflowMenuTriggerText: "More",
        overflowMenuTitleText: "All",
        overflowMenuBackIconAriaLabel: "Back",
        overflowMenuDismissIconAriaLabel: "Close menu"
      }}
    />
  );
}