import LICENCES from '../../../assets/licenses.json';

const numberRegex = /\d+(\.\d+)*/;
const atRegex = /(?:@)/gi;

type LicenceDetail = {
  title: string;
  version: string;
  licenceType: string;
  repository: string;
  licenseUrl: string;
};

export const parseLicenceData = () => {
  const licences: LicenceDetail[] = [];

  for (const [id, licence] of Object.entries(LICENCES)) {
    const version = id.match(numberRegex);

    // Removes the part after the @
    const nameWithoutVersion = id
      .replace(atRegex, '')
      .replace(version ? version[0] : '', '');

    licences.push({
      title: nameWithoutVersion,
      version: version ? version[0] : '',
      licenceType: licence.licenses,
      repository: licence.repository,
      licenseUrl: licence.licenseUrl,
    });
  }

  return licences;
};
