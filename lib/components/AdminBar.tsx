import Button from "./Button";
import { useUser } from "../hooks/useUser";
import { HomeIcon, EditIcon } from "./icons";
import { classNames } from "../utils/classNames";
import { getCloakConfig, getWpInstance } from "../config";
import { useGlobals } from "../context/GlobalsContext";

export function AdminBar({ alwaysVisible = false, className, ...props }) {
  const { pageData, isPreview } = useGlobals();
  let { isLoggedIn = false } = useUser();
  const { apiRouterBasePath } = getCloakConfig();
  const { url, adminPath } = getWpInstance().settings();

  const status =
    {
      publish: "published",
      draft: "draft",
      pending: "pending",
      future: "scheduled",
      private: "private",
    }[pageData?.status] ??
    pageData?.status ??
    "revision";

  return (
    <>
      {(alwaysVisible || isLoggedIn) && (
        <div
          id="cloakwp-admin-bar"
          className={classNames(
            "w-full h-[38px] flex items-center bg-gray-900 text-gray-200 px-3 lg:px-4 py-1.5",
            className
          )}
          {...props}
        >
          <div className="w-full flex gap-x-2 sm:gap-x-6 mb-0 text-sm">
            <a
              href={`${url}/${adminPath}/edit.php`}
              target="_blank"
              className="flex items-center"
            >
              <HomeIcon className="mr-1.5" />
              <span className="hidden sm:flex">Dashboard</span>
            </a>
            {pageData && (
              <a
                href={`${url}/${adminPath}/post.php?post=${pageData.id}&action=edit`}
                target="_blank"
                className="flex items-center"
              >
                <EditIcon className="mr-1.5" />
                Edit Page
              </a>
            )}
            {isPreview && (
              <Button
                color="gray"
                className="py-0.5 px-3 ml-auto"
                href={`/api/${apiRouterBasePath}/exit-preview?pathname=${pageData.pathname}`}
                size="small"
                openInNewTab={false}
              >
                Exit Preview
              </Button>
            )}
            {pageData && (
              <div
                className={classNames(
                  "flex items-center gap-x-2",
                  !isPreview && "ml-auto"
                )}
              >
                Status:
                <span className="rounded-full bg-gray-100 text-gray-800 py-0.5 px-2 uppercase tracking-wide text-xs font-semibold">
                  {status}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
