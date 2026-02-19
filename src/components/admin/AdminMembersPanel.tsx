import { useState } from "react";
import { CyberCard } from "@/components/cyber/CyberCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfilesWithRoles, ProfileWithRole } from "@/hooks/useProfiles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Plus, Trash2, Edit } from "lucide-react";

export function AdminMembersPanel() {
  const { data: profiles, isLoading, refetch } = useProfilesWithRoles();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ userId: string; username: string } | null>(null);
  const [newMember, setNewMember] = useState({
    email: "",
    password: "",
    role: "member" as "admin" | "member",
    department: "",
    team_role: "",
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProfileWithRole | null>(null);
  const [editData, setEditData] = useState({
    role: "member" as "admin" | "member",
    department: "",
    team_role: "",
  });

  const setUserRole = async (userId: string, role: "admin" | "member") => {
    const { error: deleteError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (deleteError) throw deleteError;

    const { error: insertError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role });

    if (insertError) throw insertError;
  };

  const handleAddMember = async () => {
    if (!newMember.email || !newMember.password) {
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading2(true);
    try {
      // Create user via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: newMember.email,
        password: newMember.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: newMember.email.split("@")[0],
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await setUserRole(data.user.id, newMember.role);

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            department: newMember.department || null,
            team_role: newMember.team_role || null,
          })
          .eq("user_id", data.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Member Added",
        description: `${newMember.email} has been added as ${newMember.role}`,
      });

      setNewMember({ email: "", password: "", role: "member", department: "", team_role: "" });
      setIsAddOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading2(false);
    }
  };

  const handleEditMember = (member: ProfileWithRole) => {
    setEditTarget(member);
    setEditData({
      role: member.role || "member",
      department: member.department || "",
      team_role: member.team_role || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdateMember = async () => {
    if (!editTarget) return;

    setIsLoading2(true);
    try {
      const originalRole = editTarget.role || "member";
      if (editData.role !== originalRole) {
        await setUserRole(editTarget.user_id, editData.role);
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          department: editData.department || null,
          team_role: editData.team_role || null,
        })
        .eq("id", editTarget.id);

      if (profileError) throw profileError;

      toast({
        title: "Member Updated",
        description: `@${editTarget.username || "member"} updated successfully.`,
      });

      setIsEditOpen(false);
      setEditTarget(null);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading2(false);
    }
  };

  const confirmDeleteMember = async () => {
    if (!deleteTarget) return;

    setIsLoading2(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }

      const response = await supabase.functions.invoke("delete-user", {
        body: { 
          userId: deleteTarget.userId,
          callingUserId: session.user.id,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to delete user");
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "User Deleted",
        description: `@${deleteTarget.username || 'User'} has been removed from the system.`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading2(false);
      setDeleteTarget(null);
    }
  };

  return (
    <CyberCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-foreground">Manage Members</h3>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button variant="cyber" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-primary/30">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="member@zerodaysquad.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="text"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  placeholder="Initial password"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newMember.role}
                  onValueChange={(value: "admin" | "member") =>
                    setNewMember({ ...newMember, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newMember.department}
                  onChange={(e) =>
                    setNewMember({ ...newMember, department: e.target.value })
                  }
                  placeholder="CSE(Cyber Security)"
                />
              </div>
              <div>
                <Label htmlFor="team_role">Team Role</Label>
                <Input
                  id="team_role"
                  value={newMember.team_role}
                  onChange={(e) =>
                    setNewMember({ ...newMember, team_role: e.target.value })
                  }
                  placeholder="Technical Support"
                />
              </div>
              <Button
                variant="cyber"
                className="w-full"
                onClick={handleAddMember}
                disabled={isLoading2}
              >
                {isLoading2 ? "Creating..." : "Create Member"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading members...</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles?.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-mono text-primary">
                    @{profile.username || "—"}
                  </TableCell>
                  <TableCell>{profile.full_name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMember(profile)}
                      disabled={isLoading2}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget({ userId: profile.user_id, username: profile.username || '' })}
                      disabled={isLoading2}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!profiles || profiles.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setEditTarget(null);
        }}
      >
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground">
              Editing{" "}
              <span className="font-mono text-primary">
                @{editTarget?.username || "member"}
              </span>
            </div>
            <div>
              <Label htmlFor="edit-role">Access Role</Label>
              <Select
                value={editData.role}
                onValueChange={(value: "admin" | "member") =>
                  setEditData({ ...editData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-department">Department</Label>
              <Input
                id="edit-department"
                value={editData.department}
                onChange={(e) =>
                  setEditData({ ...editData, department: e.target.value })
                }
                placeholder="CSE(Cyber Security)"
              />
            </div>
            <div>
              <Label htmlFor="edit-team-role">Team Role</Label>
              <Input
                id="edit-team-role"
                value={editData.team_role}
                onChange={(e) =>
                  setEditData({ ...editData, team_role: e.target.value })
                }
                placeholder="Technical Support"
              />
            </div>
            <Button
              variant="cyber"
              className="w-full"
              onClick={handleUpdateMember}
              disabled={isLoading2}
            >
              {isLoading2 ? "Updating..." : "Update Member"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-card border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-destructive">
              Delete Member
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete <span className="font-mono text-primary">@{deleteTarget?.username || 'this user'}</span>? 
              This action cannot be undone and will permanently remove the user and all their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-muted-foreground/30">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMember}
              disabled={isLoading2}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading2 ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CyberCard>
  );
}
