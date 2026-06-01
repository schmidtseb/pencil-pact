import{d as e}from"./index-CaEDKEw2.js";async function t(t){let{data:n,error:r}=await e.from(`group_members`).select(`group_id, role`).eq(`user_id`,t);if(r)throw r;if(!n||n.length===0)return[];let i=n.map(e=>e.group_id),{data:a,error:o}=await e.from(`groups`).select(`
      *,
      group_members (
        id,
        user_id,
        role,
        profiles:user_id (
          display_name,
          avatar_url
        )
      )
    `).in(`id`,i);if(o)throw o;return a.map(e=>({...e,userRole:n.find(t=>t.group_id===e.id)?.role||`member`}))}async function n(t){let{data:n,error:r}=await e.from(`groups`).insert([{name:t.name,description:t.description||null,timezone:t.timezone||`UTC`,created_by:t.created_by,suggestion_deadline_hour:t.suggestion_deadline_hour??12,voting_deadline_hour:t.voting_deadline_hour??22,reveal_hour:t.reveal_hour??7,upload_deadline_hour:t.upload_deadline_hour??23,location_lat:t.location_lat??null,location_lng:t.location_lng??null,location_name:t.location_name??null}]).select().single();if(r)throw r;let{error:i}=await e.from(`group_members`).insert([{group_id:n.id,user_id:t.created_by,role:`admin`}]);if(i)throw await e.from(`groups`).delete().eq(`id`,n.id),i;let{error:a}=await e.from(`streaks`).insert([{user_id:t.created_by,group_id:n.id,current_streak:0,longest_streak:0}]);return a&&console.error(`Failed to initialize streak record:`,a),n}async function r(t,n){let{data:r,error:i}=await e.rpc(`join_group_with_invite_code`,{p_invite_code:t.trim()});if(i)throw Error(i.message||`Failed to join group. Please check the invite code.`);let{data:a,error:o}=await e.from(`groups`).select(`*`).eq(`id`,r).single();if(o||!a)throw Error(`Successfully joined, but failed to load group details.`);return a}async function i(t,n){let{data:r,error:i}=await e.from(`groups`).select(`
      *,
      group_members (
        id,
        user_id,
        role,
        joined_at,
        profiles:user_id (
          display_name,
          avatar_url
        )
      )
    `).eq(`id`,t).single();if(i)throw i;let{data:a,error:o}=await e.from(`streaks`).select(`*`).eq(`group_id`,t);if(o)throw o;let{data:s}=await e.from(`daily_challenges`).select(`*`).eq(`group_id`,t).neq(`phase`,`completed`).order(`challenge_date`,{ascending:!0}),c=r.group_members.find(e=>e.user_id===n);if(!c)throw Error(`You are not authorized to view this group.`);return{group:r,streaks:a,userRole:c.role,activeChallenges:s||[]}}export{r as i,i as n,t as r,n as t};