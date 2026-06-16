import siteSettings from './siteSettings';
import review from './review';
import blogPost from './blogPost';
import project from './project';
import blockContent from './blockContent';

/**
 * Phase 1 content models — the things Dustin edits most:
 * reviews, blog/resource posts, job photos (before/after + galleries),
 * and the core business info. Services & locations stay in the code repo
 * for now and can be migrated into the studio in a later phase.
 */
export const schemaTypes = [siteSettings, review, blogPost, project, blockContent];
