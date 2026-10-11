import {sharedData} from '@/lib/snapshot-store';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){return Response.json(sharedData(),{headers:{'Cache-Control':'no-store'}});}
