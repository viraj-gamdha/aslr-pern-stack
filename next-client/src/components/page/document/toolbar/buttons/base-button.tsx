import { Button } from '@/components/ui/button';
import Tooltip from '@/components/ui/tooltip';
import { LucideIcon } from 'lucide-react';
import React from 'react'

// Basic toolbar button
interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
  label: string;
}

const BaseButton = ({
  onClick,
  isActive,
  icon: Icon,
  label,
}: ToolbarButtonProps) => (
  <Tooltip tooltip={label} position="bottom">
    <Button variant="icon_bordered" isActive={isActive} onClick={onClick}>
      <Icon size={16}/>
    </Button>
  </Tooltip>
);

export default BaseButton