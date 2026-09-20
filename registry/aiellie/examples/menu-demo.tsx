"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  BellIcon,
  CloudIcon,
  ComputerIcon,
  CreditCardIcon,
  CssFile01Icon,
  Doc01Icon,
  Download02Icon,
  File01Icon,
  FloppyDiskIcon,
  Folder01Icon,
  FolderOpenIcon,
  HelpCircleIcon,
  HtmlFile01Icon,
  JavaScriptIcon,
  KeyboardIcon,
  LanguageCircleIcon,
  Layout01Icon,
  Logout01Icon,
  Mail01Icon,
  Message01Icon,
  Moon02Icon,
  MoreHorizontalIcon,
  Notification01Icon,
  PaintBoardIcon,
  PlusSignIcon,
  Search01Icon,
  Settings01Icon,
  Shield01Icon,
  SidebarLeftIcon,
  SlackIcon,
  Sun01Icon,
  Typescript01Icon,
  User02Icon,
  UserAdd01Icon,
  WebhookIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/registry/aiellie/ui/button"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@/registry/aiellie/ui/menu"

/**
 * Every row the menu ships, in one popup: plain items with shortcuts, submenus
 * nested three deep, checkbox and radio rows that hold their own state, a
 * disabled row, a real link and the destructive row.
 *
 * The state here is only what a menu of this shape would already be reading
 * from somewhere — settings live outside the menu, so the demo holds them too.
 */
export default function MenuDemo() {
  const [sidebar, setSidebar] = React.useState(true)
  const [statusBar, setStatusBar] = React.useState(false)
  const [theme, setTheme] = React.useState("light")
  const [notifications, setNotifications] = React.useState({
    push: true,
    email: true,
  })

  return (
    <Menu>
      {/* `render` makes the existing button the trigger rather than nesting one
          button inside another. The chevron turns on the button's own
          `aria-expanded`, so nothing has to be told the menu is open. */}
      <MenuTrigger render={<Button variant="outline" />}>
        Options
        <HugeiconsIcon
          aria-hidden
          data-icon="inline-end"
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className="transition-transform duration-150 group-aria-expanded/button:rotate-180 motion-reduce:transition-none"
        />
      </MenuTrigger>

      <MenuContent showSearch className="min-w-52">
        <MenuGroup>
          <MenuGroupLabel>File</MenuGroupLabel>
          <MenuItem>
            <HugeiconsIcon aria-hidden icon={File01Icon} />
            New File
            <MenuShortcut>⌘N</MenuShortcut>
          </MenuItem>
          <MenuItem>
            <HugeiconsIcon aria-hidden icon={Folder01Icon} />
            New Folder
            <MenuShortcut>⇧⌘N</MenuShortcut>
          </MenuItem>
          <MenuSub>
            <MenuSubTrigger>
              <HugeiconsIcon aria-hidden icon={FolderOpenIcon} />
              Open Recent
            </MenuSubTrigger>
            <MenuSubContent>
              <MenuGroup>
                <MenuGroupLabel>Recent Projects</MenuGroupLabel>
                <MenuItem>
                  <HugeiconsIcon aria-hidden icon={HtmlFile01Icon} />
                  Project Alpha
                </MenuItem>
                <MenuItem>
                  <HugeiconsIcon aria-hidden icon={CssFile01Icon} />
                  Project Beta
                </MenuItem>
                <MenuSub>
                  <MenuSubTrigger>
                    <HugeiconsIcon aria-hidden icon={MoreHorizontalIcon} />
                    More Projects
                  </MenuSubTrigger>
                  <MenuSubContent>
                    <MenuItem>
                      <HugeiconsIcon aria-hidden icon={JavaScriptIcon} />
                      Project Gamma
                    </MenuItem>
                    <MenuItem>
                      <HugeiconsIcon aria-hidden icon={Typescript01Icon} />
                      Project Delta
                    </MenuItem>
                  </MenuSubContent>
                </MenuSub>
              </MenuGroup>
              <MenuSeparator />
              <MenuItem>
                <HugeiconsIcon aria-hidden icon={Search01Icon} />
                Browse...
                <MenuShortcut>⌘K</MenuShortcut>
              </MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuSeparator />
          <MenuItem>
            <HugeiconsIcon aria-hidden icon={FloppyDiskIcon} />
            Save
            <MenuShortcut>⌘S</MenuShortcut>
          </MenuItem>
          <MenuItem>
            <HugeiconsIcon aria-hidden icon={Download02Icon} />
            Export
            <MenuShortcut>⇧⌘E</MenuShortcut>
          </MenuItem>
        </MenuGroup>

        <MenuSeparator />

        {/* Checkbox and radio rows keep the menu open when clicked, which is
            the primitive's default — a settings row you have to reopen the
            menu to change twice is the wrong shape. */}
        <MenuGroup>
          <MenuGroupLabel>View</MenuGroupLabel>
          <MenuCheckboxItem checked={sidebar} onCheckedChange={setSidebar}>
            Show Sidebar
          </MenuCheckboxItem>
          <MenuCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
            Show Status Bar
          </MenuCheckboxItem>
          <MenuSub>
            <MenuSubTrigger>Theme</MenuSubTrigger>
            <MenuSubContent>
              <MenuGroup>
                <MenuGroupLabel>Appearance</MenuGroupLabel>
                <MenuRadioGroup value={theme} onValueChange={setTheme}>
                  <MenuRadioItem value="light">
                    <HugeiconsIcon aria-hidden icon={Sun01Icon} />
                    Light
                  </MenuRadioItem>
                  <MenuRadioItem value="dark">
                    <HugeiconsIcon aria-hidden icon={Moon02Icon} />
                    Dark
                  </MenuRadioItem>
                  <MenuRadioItem value="system">
                    <HugeiconsIcon aria-hidden icon={ComputerIcon} />
                    System
                  </MenuRadioItem>
                </MenuRadioGroup>
              </MenuGroup>
            </MenuSubContent>
          </MenuSub>
        </MenuGroup>

        <MenuSeparator />

        <MenuGroup>
          <MenuGroupLabel>Account</MenuGroupLabel>
          <MenuItem>
            <HugeiconsIcon aria-hidden icon={User02Icon} />
            Profile
            <MenuShortcut>⇧⌘P</MenuShortcut>
          </MenuItem>
          <MenuItem>
            <HugeiconsIcon aria-hidden icon={CreditCardIcon} />
            Billing
            <MenuShortcut>⌘B</MenuShortcut>
          </MenuItem>
          <MenuSub>
            <MenuSubTrigger>
              <HugeiconsIcon aria-hidden icon={Settings01Icon} />
              Settings
            </MenuSubTrigger>
            <MenuSubContent>
              <MenuGroup>
                <MenuGroupLabel>Preferences</MenuGroupLabel>
                <MenuItem>
                  <HugeiconsIcon aria-hidden icon={KeyboardIcon} />
                  Keyboard Shortcuts
                </MenuItem>
                <MenuItem>
                  <HugeiconsIcon aria-hidden icon={LanguageCircleIcon} />
                  Language
                </MenuItem>
                <MenuSub>
                  <MenuSubTrigger>
                    <HugeiconsIcon aria-hidden icon={Notification01Icon} />
                    Notifications
                  </MenuSubTrigger>
                  <MenuSubContent>
                    <MenuGroup>
                      <MenuGroupLabel>Notification Types</MenuGroupLabel>
                      <MenuCheckboxItem
                        checked={notifications.push}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            push: checked,
                          }))
                        }
                      >
                        <HugeiconsIcon aria-hidden icon={BellIcon} />
                        Push Notifications
                      </MenuCheckboxItem>
                      <MenuCheckboxItem
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            email: checked,
                          }))
                        }
                      >
                        <HugeiconsIcon aria-hidden icon={Mail01Icon} />
                        Email Notifications
                      </MenuCheckboxItem>
                    </MenuGroup>
                  </MenuSubContent>
                </MenuSub>
              </MenuGroup>
              <MenuSeparator />
              <MenuItem>
                <HugeiconsIcon aria-hidden icon={Shield01Icon} />
                Privacy & Security
              </MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuGroup>

        <MenuSeparator />

        <MenuGroup>
          <MenuGroupLabel>Team</MenuGroupLabel>
          <MenuSub>
            <MenuSubTrigger>
              <HugeiconsIcon aria-hidden icon={UserAdd01Icon} />
              Invite users
            </MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>
                <HugeiconsIcon aria-hidden icon={Mail01Icon} />
                Email
              </MenuItem>
              <MenuItem>
                <HugeiconsIcon aria-hidden icon={Message01Icon} />
                Message
              </MenuItem>
              <MenuSeparator />
              <MenuSub>
                <MenuSubTrigger>
                  <HugeiconsIcon aria-hidden icon={PlusSignIcon} />
                  More...
                </MenuSubTrigger>
                <MenuSubContent>
                  <MenuItem>
                    <HugeiconsIcon aria-hidden icon={SlackIcon} />
                    Slack
                  </MenuItem>
                  <MenuItem>
                    <HugeiconsIcon aria-hidden icon={WebhookIcon} />
                    Webhook
                  </MenuItem>
                </MenuSubContent>
              </MenuSub>
            </MenuSubContent>
          </MenuSub>
          <MenuItem disabled>
            <HugeiconsIcon aria-hidden icon={CloudIcon} />
            API
            <MenuShortcut>⌘A</MenuShortcut>
          </MenuItem>
        </MenuGroup>

        <MenuSeparator />

        <MenuGroup>
          <MenuItem>
            <HugeiconsIcon aria-hidden icon={HelpCircleIcon} />
            Help & Support
          </MenuItem>
          {/* A real anchor, so cmd-click and open-in-new-tab still work. */}
          <MenuLinkItem
            href="https://base-ui.com/react/components/menu"
            target="_blank"
            rel="noreferrer"
            closeOnClick
          >
            <HugeiconsIcon aria-hidden icon={Doc01Icon} />
            Documentation
          </MenuLinkItem>
        </MenuGroup>

        <MenuSeparator />

        <MenuItem variant="destructive">
          <HugeiconsIcon aria-hidden icon={Logout01Icon} />
          Sign Out
          <MenuShortcut>⇧⌘Q</MenuShortcut>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
