import { canRenderMedia, mayPublishMedia, isProductionReadyMedia, publicationFlags, type CuratedMediaAsset, type PublicationFlag } from "./media.ts";

export interface VisitorMedia {
  id: string;
  class: CuratedMediaAsset["class"];
  title: string;
  creator: string;
  creationDate: string;
  depictedPeriod: string;
  sourceInstitution: string;
  sourceRecordUrl: string;
  originalAssetUrl: string;
  license: string;
  rightsStatement: string;
  requiredAttribution: string;
  localPath: string;
  altText: string;
  caption: string;
  historicalFit: string;
  publication: { renderable: boolean; publishable: boolean; ready: boolean; provisional: boolean; flags: readonly PublicationFlag[] };
}

/** Keep visible provenance, evaluate gates at source, omit private review records. */
export function projectVisitorMedia(asset: CuratedMediaAsset): VisitorMedia {
  return {
    id: asset.id, class: asset.class, title: asset.title, creator: asset.creator,
    creationDate: asset.creationDate, depictedPeriod: asset.depictedPeriod,
    sourceInstitution: asset.sourceInstitution, sourceRecordUrl: asset.sourceRecordUrl,
    originalAssetUrl: asset.originalAssetUrl, license: asset.license,
    rightsStatement: asset.rightsStatement, requiredAttribution: asset.requiredAttribution,
    localPath: asset.localPath, altText: asset.altText, caption: asset.caption,
    historicalFit: asset.historicalFit,
    publication: {
      renderable: canRenderMedia(asset), publishable: mayPublishMedia(asset),
      ready: isProductionReadyMedia(asset), provisional: asset.reviewStatus !== "approved",
      flags: publicationFlags(asset),
    },
  };
}
