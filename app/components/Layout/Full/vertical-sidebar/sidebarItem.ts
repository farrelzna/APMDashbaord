import {
  LayoutDashboardIcon, BorderAllIcon,
  BoxMultiple1Icon,
  UsersIcon,
  RefreshIcon,
  NoteIcon,
  UserIcon
} from 'vue-tabler-icons';

import { pagePermission } from '~/utils/permissions'

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  BgColor?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
  permission?: string[];
}

const sidebarItem: menu[] = [
  { header: 'Home' },
  {
    title: 'Dashboard',
    icon: LayoutDashboardIcon,
    to: '/'
  },
  {
    title: 'Client',
    icon: UsersIcon,
    to: '/dashboard/clients',

    permission: [
      pagePermission.client.view
    ]
  },
  {
    title: 'End User',
    icon: UsersIcon,
    to: '/dashboard/end_user',

    permission: [
      pagePermission.client.view
    ]
  },
  {
    title: 'Projects',
    icon: BoxMultiple1Icon,
    to: '/dashboard/project',
    permission: [
      pagePermission.project.view
    ]
  },
  {
    title: 'Users',
    icon: UserIcon,
    to: '/dashboard/users',
    permission: [
      pagePermission.project.view
    ]
  },
  // {
  //   title: 'Daily Update',
  //   icon: RefreshIcon,
  //   to: '/dashboard/standup',
  //   permission: [
  //     pagePermission.projectStandup.view
  //   ]
  // }
];

export default sidebarItem;
