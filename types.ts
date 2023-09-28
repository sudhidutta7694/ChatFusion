import { Server, Member, Profile } from "./prisma/generated/client"

export type ServerWithMembersWithProfiles = Server & {
    Member : (Member & {profile: Profile})[];
}