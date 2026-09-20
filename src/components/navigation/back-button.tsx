"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getInternalNavDepth, useBackNavigation } from "@/lib/navigation";

export type BackButtonVariant =
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";

export type BackButtonSize =
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg";

export interface BackButtonProps {
    /**
     * Where to go when the user has no in-app history (deep link, new tab,
     * bookmark). Defaults to the home page.
     */
    fallback?: string;
    /** Text shown when going back through real in-app history. */
    label?: string;
    /** Text shown when there is no in-app history and `fallback` is used. */
    fallbackLabel?: string;
    variant?: BackButtonVariant;
    size?: BackButtonSize;
    className?: string;
    /** Icon rendered before the label. Defaults to an arrow-left. */
    icon?: LucideIcon;
    /** Accessible name, mainly for icon-only buttons. */
    "aria-label"?: string;
}

/**
 * History-aware back button.
 *
 * Replaces hardcoded `<Link href="/some-parent">` back affordances: pressing it
 * walks back through the sequence of pages the user actually visited, and only
 * falls back to a fixed parent route when there is no in-app history.
 */
export function BackButton({
    fallback = "/",
    label = "Back",
    fallbackLabel,
    variant = "outline",
    size = "default",
    className,
    icon: Icon = ArrowLeft,
    "aria-label": ariaLabel,
}: BackButtonProps) {
    const goBack = useBackNavigation(fallback);
    const [depth, setDepth] = useState(0);

    // Depth is only knowable client-side; keep the first paint SSR-safe.
    useEffect(() => {
        setDepth(getInternalNavDepth());
    }, []);

    const iconOnly = size.startsWith("icon");
    const text = depth === 0 && fallbackLabel ? fallbackLabel : label;

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            onClick={goBack}
            aria-label={ariaLabel ?? (iconOnly ? text : undefined)}
            className={cn("rounded-xl gap-2 font-bold", className)}
        >
            <Icon className="w-4 h-4" />
            {!iconOnly && <span>{text}</span>}
        </Button>
    );
}
