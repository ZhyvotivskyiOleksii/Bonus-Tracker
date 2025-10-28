"use client";

import React from "react";
import { ThumbsUp, Heart, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Props = {
  keyId: string; // stable key for DB (e.g., "mike-ohio")
  name: string;
  place: string;
  text: string;
};

export function TestimonialCard({ keyId, name, place, text }: Props) {
  const [liked, setLiked] = React.useState(false);
  const [hearted, setHearted] = React.useState(false);
  const [heartCount, setHeartCount] = React.useState<number>(0);
  const [likesCount, setLikesCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  // deterministic pseudo-random baseline per testimonial key
  const randBase = React.useMemo(() => {
    const hash = (s: string) => {
      let h = 0;
      for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
      return Math.abs(h >>> 0);
    };
    const baseH = 5 + (hash(keyId + ":h") % 36);   // 5..40
    const baseL = 10 + (hash(keyId + ":l") % 50);  // 10..59
    return { baseH, baseL };
  }, [keyId]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const supabase = createClient();
        // current user reaction
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("testimonial_reactions")
            .select("liked, heart")
            .eq("testimonial_key", keyId)
            .eq("user_id", user.id)
            .maybeSingle();
          if (mounted && data) {
            setLiked(!!data.liked);
            setHearted(!!data.heart);
          }
        }
        // total hearts via count only
        const { count: heartDb } = await supabase
          .from("testimonial_reactions")
          .select("*", { count: "exact", head: true })
          .eq("testimonial_key", keyId)
          .eq("heart", true);
        if (mounted) setHeartCount((heartDb || 0) + randBase.baseH);

        // total likes via count only
        const { count: likeDb } = await supabase
          .from("testimonial_reactions")
          .select("*", { count: "exact", head: true })
          .eq("testimonial_key", keyId)
          .eq("liked", true);
        if (mounted) setLikesCount((likeDb || 0) + randBase.baseL);
      } catch {
        // ignore network errors in UI
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [keyId, randBase]);

  const onToggle = async (field: "liked" | "heart") => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Login required', description: 'Reactions are available only for registered users.' });
      return;
    }
    const nextLiked = field === "liked" ? !liked : liked;
    const nextHeart = field === "heart" ? !hearted : hearted;
    // optimistic
    if (field === "liked") {
      setLiked(nextLiked);
      setLikesCount((c) => c + (nextLiked ? 1 : -1));
    }
    if (field === "heart") {
      setHearted(nextHeart);
      setHeartCount((c) => c + (nextHeart ? 1 : -1));
    }
    // upsert
    try {
      await supabase
        .from("testimonial_reactions")
        .upsert({
          testimonial_key: keyId,
          user_id: user.id,
          liked: nextLiked,
          heart: nextHeart,
          updated_at: new Date().toISOString(),
        }, { onConflict: "testimonial_key,user_id" });
    } catch {
      // revert optimistic on error
      if (field === "liked") {
        setLiked(!nextLiked);
        setLikesCount((c) => c + (nextLiked ? -1 : 1));
      }
      if (field === "heart") {
        setHearted(!nextHeart);
        setHeartCount((c) => c + (nextHeart ? -1 : 1));
      }
    }
  };

  return (
    <div className="group relative transition-transform duration-300 hover:-translate-y-0.5 h-full">
      <div className="relative h-full overflow-hidden rounded-2xl border border-white/12 bg-white/[0.05] p-4 sm:p-5 backdrop-blur-sm shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]">
        {/* unified inner gradient + subtle corner glows (match site lights) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(79,70,229,0.10),transparent_55%)]" />
        <div aria-hidden className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-[radial-gradient(300px_200px_at_0%_0%,hsl(var(--primary)/0.18),transparent_62%)]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-[radial-gradient(300px_200px_at_100%_100%,hsl(var(--primary)/0.12),transparent_62%)]" />
        <div className="flex items-start flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {/* Avatar with brand gradient ring */}
            <span
              className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full p-[1.2px] shadow-[0_8px_26px_-12px_rgba(79,70,229,0.45)]"
              style={{ background: "conic-gradient(from 140deg, #4F46E5, #22C55E, #F59E0B, #4F46E5)" }}
            >
              <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-card/80 ring-1 ring-white/20 text-white/90 font-bold">
                {(name || "?").slice(0,1)}
              </span>
            </span>
            <div>
              <div className="text-sm font-semibold tracking-wide text-primary uppercase">{name} · {place}</div>
            </div>
          </div>
          {/* star ribbon in brand tones */}
          <div className="flex items-center gap-1.5 ml-auto mt-2 sm:mt-0">
            {Array.from({ length: 5 }).map((_, s) => (
              <span
                key={s}
                className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-[6px] p-[1px]"
                style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.45), rgba(147,51,234,0.35))" }}
              >
                <span className="rounded-[inherit] h-full w-full inline-flex items-center justify-center bg-white/5 ring-1 ring-white/15 text-primary">
                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex gap-2 text-white/90">
          <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-primary/70 mt-1 shrink-0" />
          <p className="text-[14px] sm:text-[15px] leading-relaxed">{text}</p>
        </div>

        {/* Reactions */}
        <div className="mt-3 sm:mt-4 flex items-center justify-end gap-3 text-white/80">
          <button
            type="button"
            onClick={() => onToggle("liked")}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] ring-1",
              liked ? "bg-primary/20 ring-primary/40 text-primary" : "bg-white/5 ring-white/15 hover:bg-white/10"
            )}
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="tabular-nums">{likesCount}</span>
          </button>
          <button
            type="button"
            onClick={() => onToggle("heart")}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] ring-1",
              hearted ? "bg-rose-500/20 ring-rose-400/40 text-rose-300" : "bg-white/5 ring-white/15 hover:bg-white/10"
            )}
          >
            <Heart className={cn("h-4 w-4", hearted && "fill-current")} />
            <span className="tabular-nums">{heartCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
