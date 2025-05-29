import { SchemaCompTreeItem } from '@peeto/core';

/**
 * 组件和dom映射关系
 */
export type CompDomMap = Map<SchemaCompTreeItem['id'], HTMLElement[]>;
