import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AuthorCardProps {
  name: string;
  avatar_url?: string | null;
  bio?: string | null;
  title?: string | null;
}

const AuthorCard = ({ name, avatar_url, bio, title }: AuthorCardProps) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <Avatar className="h-12 w-12">
        {avatar_url && <AvatarImage src={avatar_url} alt={name} />}
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="font-semibold text-foreground">{name}</p>
        {title && <p className="text-sm text-muted-foreground">{title}</p>}
        {bio && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{bio}</p>}
      </div>
    </div>
  );
};

export default AuthorCard;
