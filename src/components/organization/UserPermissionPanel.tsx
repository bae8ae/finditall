"use client";

import { useState } from "react";
import { Plus, Shield, Mail } from "lucide-react";
import { Card, Button, SectionTitle, Modal, Field, Input, Select } from "../ui/primitives";
import { RoleBadge } from "../StatusBadge";
import { useStore } from "@/lib/store";
import { useToast } from "../ui/toast";
import { cn } from "@/lib/utils";
import type { OrgMember, UserRole } from "@/lib/types";

const ROLE_DESC: { role: UserRole; label: string; desc: string }[] = [
  { role: "admin", label: "Admin", desc: "전체 관리 · 설정 · 권한 부여" },
  { role: "manager", label: "Manager", desc: "이용자 · 이벤트 · 허브 운영 관리" },
  { role: "staff", label: "Staff", desc: "담당 이벤트 확인 및 조치 처리" },
  { role: "viewer", label: "Viewer", desc: "조회만 가능" },
];

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  active: { label: "활성", cls: "text-mint" },
  invited: { label: "초대됨", cls: "text-warn" },
  disabled: { label: "비활성", cls: "text-muted" },
};

export function UserPermissionPanel() {
  const { state, addMember, updateMember } = useStore();
  const members = state.members;
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("staff");
  const [zonesStr, setZonesStr] = useState("");

  function invite() {
    if (!name.trim() || !email.trim()) {
      toast({ kind: "error", title: "이름과 이메일을 입력해주세요." });
      return;
    }
    addMember({
      name: name.trim(),
      email: email.trim(),
      role,
      zones: zonesStr.trim() || "미지정",
      status: "invited",
    } as Omit<OrgMember, "id">);
    toast({ kind: "success", title: "사용자 초대 전송", desc: email.trim() });
    setName("");
    setEmail("");
    setRole("staff");
    setZonesStr("");
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <SectionTitle
        title="권한 관리"
        desc="이용자 정보와 생활 안전 이벤트의 역할 기반 접근 제어 (RBAC)"
        icon={<Shield className="size-5" />}
        action={
          <Button variant="mint" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> 사용자 초대
          </Button>
        }
      />

      {/* role legend */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {ROLE_DESC.map((r) => (
          <Card key={r.role} className="p-3">
            <RoleBadge role={r.role} />
            <p className="mt-2 text-xs text-muted">{r.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-border-soft text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">이름</th>
              <th className="px-4 py-3 font-medium">이메일</th>
              <th className="px-4 py-3 font-medium">역할</th>
              <th className="px-4 py-3 font-medium">담당 구역</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 text-right font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const st = STATUS_LABEL[m.status];
              return (
                <tr
                  key={m.id}
                  className="border-b border-border-soft/60 last:border-0 hover:bg-surface/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-pink/30 to-mint/20 text-xs font-bold text-text">
                        {m.name.slice(0, 1)}
                      </span>
                      <span className="font-medium text-text">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{m.email}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={m.role}
                      onChange={(e) => {
                        updateMember(m.id, { role: e.target.value as UserRole });
                        toast({ kind: "info", title: `${m.name} 역할 변경`, desc: e.target.value });
                      }}
                      className="h-8 w-28 py-1 text-xs"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                      <option value="viewer">Viewer</option>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-muted">{m.zones}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-semibold", st.cls)}>● {st.label}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        updateMember(m.id, {
                          status: m.status === "disabled" ? "active" : "disabled",
                        });
                        toast({
                          kind: m.status === "disabled" ? "success" : "warn",
                          title: m.status === "disabled" ? "계정 활성화" : "계정 비활성화",
                          desc: m.name,
                        });
                      }}
                    >
                      {m.status === "disabled" ? "활성화" : "비활성화"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="사용자 초대"
        desc="새 멤버를 초대하고 역할을 지정하세요."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>취소</Button>
            <Button variant="mint" onClick={invite}>
              <Mail className="size-4" /> 초대 보내기
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="이름" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />
          </Field>
          <Field label="이메일" required>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
          </Field>
          <Field label="역할">
            <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="viewer">Viewer</option>
            </Select>
          </Field>
          <Field label="담당 구역">
            <Input value={zonesStr} onChange={(e) => setZonesStr(e.target.value)} placeholder="예: 2층 병동" />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
