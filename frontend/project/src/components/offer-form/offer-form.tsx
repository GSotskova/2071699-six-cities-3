import './offer-form.css';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import Select from 'react-select';

import { City, NewOffer, Offer } from '../../types/types';

import LocationPicker from '../location-picker/location-picker';
import { CITIES, CityLocation, GOODS, TYPES } from '../../const';
import { capitalize } from '../../utils/utils';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getImagesFileArr } from '../../store/site-process/selectors';
import { setImagesFileArr } from '../../store/site-process/site-process';

enum FormFieldName {
  title = 'title',
  description = 'description',
  cityName = 'cityName',
  previewImage = 'previewImage',
  isPremium = 'isPremium',
  type = 'type',
  bedrooms = 'bedrooms',
  maxAdults = 'maxAdults',
  price = 'price',
  good = 'good-',
  image = 'image'
}

const getGoods = (
  entries: IterableIterator<[string, FormDataEntryValue]>
): string[] => {
  const chosenGoods: string[] = [];
  for (const entry of entries) {
    if (entry[0].startsWith(FormFieldName.good)) {
      chosenGoods.push(entry[0].slice(FormFieldName.good.length));
    }
  }
  return chosenGoods;
};

const getCity = (cityName: FormDataEntryValue | null): City => {
  const name = String(cityName);
  if (cityName && CITIES.includes(name)) {
    return {
      name,
      location: CityLocation[name],
    };
  }

  return { name: CITIES[0], location: CityLocation[CITIES[0]] };
};

type OfferFormProps<T> = {
  offer: T;
  onSubmit: (offerData: T) => void;
};

const OfferForm = <T extends Offer | NewOffer>({
  offer,
  onSubmit,
}: OfferFormProps<T>): JSX.Element => {
  const dispatch = useAppDispatch();
  const {
    title,
    description,
    city,
    previewImage,
    isPremium,
    type,
    bedrooms,
    maxAdults,
    price,
    goods: chosenGoods,
    location,
    images
  } = offer;
  const [chosenLocation, setChosenLocation] = useState(location);
  const [chosenCity, setChosenCity] = useState(city);
  const [prevImg, setImage] = useState<File | undefined>();


  const imagesStateArr = useAppSelector(getImagesFileArr);
  const imagesFileArr = imagesStateArr.find((el) => el.title === title)?.files;

  const isNewOffer = imagesFileArr?.length === 0? true : false;

  const [imagesArr, setImages] = useState<File[]>( imagesFileArr ? imagesFileArr : []);


  const handleCityChange = (value: keyof typeof CityLocation) => {
    setChosenCity(getCity(value));
    setChosenLocation(CityLocation[value]);
  };

  const handleLocationChange = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      setChosenLocation({ latitude: lat, longitude: lng });
    },
    []
  );

  const handleImageUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) {
      return;
    }
    setImage(evt.target.files[0]);
  };

  const handleImageItemUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) {
      return;
    }
    const index = Number(evt.target.name.substring(10, evt.target.name.length));
    setImages([...imagesArr.slice(0, index), evt.target.files[0], ...imagesArr.slice(index + 1)]);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const titleStr = formData.get(FormFieldName.title) as string;
    dispatch(setImagesFileArr({title: titleStr, files: imagesArr}));
    const data = {
      ...offer,
      title: formData.get(FormFieldName.title),
      description: formData.get(FormFieldName.description),
      city: getCity(formData.get(FormFieldName.cityName)),
      previewImage: prevImg,
      isPremium: Boolean(formData.get(FormFieldName.isPremium)),
      type: formData.get(FormFieldName.type),
      bedrooms: Number(formData.get(FormFieldName.bedrooms)),
      maxAdults: Number(formData.get(FormFieldName.maxAdults)),
      price: Number(formData.get(FormFieldName.price)),
      goods: getGoods(formData.entries()),
      location: chosenLocation,
      images: imagesArr,
      prevImg: prevImg
    };

    onSubmit(data);
  };

  return (
    <form
      className="form offer-form"
      action="#"
      method="post"
      encType="multipart/form-data"
      onSubmit={handleFormSubmit}
    >
      <fieldset className="title-fieldset">
        <div className="form__input-wrapper">
          <label htmlFor="title" className="title-fieldset__label">
            Title
          </label>
          <input
            className="form__input title-fieldset__text-input"
            placeholder="Title"
            name={FormFieldName.title}
            id="title"
            required
            defaultValue={title}
          />
        </div>
        <div className="title-fieldset__checkbox-wrapper">
          <input
            className="form__input"
            type="checkbox"
            name={FormFieldName.isPremium}
            id="isPremium"
            defaultChecked={isPremium}
          />
          <label htmlFor="isPremium" className="title-fieldset__checkbox-label">
            Premium
          </label>
        </div>
      </fieldset>
      <div className="form__input-wrapper">
        <label htmlFor="description" className="offer-form__label">
          Description
        </label>
        <textarea
          className="form__input offer-form__textarea"
          placeholder="Description"
          name={FormFieldName.description}
          id="description"
          required
          defaultValue={description}
        />
      </div>
      {prevImg ? (
        <img
          className="offer-form__image"
          src={URL.createObjectURL(prevImg)}
          alt=" "
        />
      ) : (
        <img
          className={`offer-form__image ${previewImage ==='' ? 'hidden__image' : ''}`}
          src={previewImage}
          alt=" "
        />
      )}
      <div className="form__input-wrapper">
        <label htmlFor="previewImage" className="offer-form__label">
          Preview Image
        </label>
        {isNewOffer ? (
        <input
          className="form__input offer-form__text-input"
          type="file"
          placeholder="Preview image"
          name="prevImg"
          id="prevImg"
          required
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
        />
        ) : (
        <input
          className="form__input offer-form__text-input"
          type="file"
          placeholder="Preview image"
          name="prevImg"
          id="prevImg"
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
        />
        )}
        <input
          className="form__input offer-form__text-input"
          type="hidden"
          name={FormFieldName.previewImage}
          id="previewImage"
          required
          defaultValue={prevImg ? URL.createObjectURL(prevImg) : previewImage}
        />
      </div>
      <fieldset className="images-fieldset">
        {images.map((image, index) => (
          <div key={image} className="form__input-wrapper">
            <label htmlFor={`image=${index}`} className="offer-form__label">
          Offer Image #{index + 1}
            </label>
                <input
                  className="form__input offer-form__text-input"
                  type="hidden"
                  placeholder="Offer image hidden"
                  name={`${FormFieldName.image}hidden-${index}`}
                  id={`image_hidden-${index}`}
                  required
                  defaultValue={`imagesArr-${index}`}
                />
            {(!isNewOffer) ? (
              <div>
              <img
                    className={`offer-form__image ${(!imagesArr[index]) ?  'hidden__image' : '' }`}
                    src={imagesArr[index] ? URL.createObjectURL(imagesArr[index]) : ''}
                    alt=" "
                  />
                <input
                  className="form__input offer-form__text-input"
                  type="file"
                  placeholder="Offer image"
                  name={`imagesArr-${index}`}
                  id={`imagesArr-${index}`}
                  onChange={handleImageItemUpload}
                 />
             </div>
            ) : (
              <div>
              <img
                    className={`offer-form__image ${(!imagesArr[index]) ?  'hidden__image' : '' }`}
                    src={imagesArr[index] ? URL.createObjectURL(imagesArr[index]) : ''}
                    alt=" "
                  />
                <input
                  className="form__input offer-form__text-input"
                  type="file"
                  placeholder="Offer image"
                  name={`imagesArr-${index}`}
                  id={`imagesArr-${index}`}
                  required
                  onChange={handleImageItemUpload}
                />
                </div>
          )}
          </div>
        ))}

      </fieldset>
      <fieldset className="type-fieldset">
        <div className="form__input-wrapper">
          <label htmlFor="type" className="type-fieldset__label">
            Type
          </label>
          <Select
            className="type-fieldset__select"
            classNamePrefix="react-select"
            name={FormFieldName.type}
            id="type"
            defaultValue={{ value: type, label: capitalize(type) }}
            options={TYPES.map((typeItem) => ({
              value: typeItem,
              label: capitalize(typeItem),
            }))}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="price" className="type-fieldset__label">
            Price
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="100"
            name={FormFieldName.price}
            id="price"
            min="100"
            max="100000"
            defaultValue={price}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="bedrooms" className="type-fieldset__label">
            Bedrooms
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="1"
            name={FormFieldName.bedrooms}
            id="bedrooms"
            required
            step={1}
            min="1"
            max="8"
            defaultValue={bedrooms}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="maxAdults" className="type-fieldset__label">
            Max adults
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="1"
            name={FormFieldName.maxAdults}
            id="maxAdults"
            required
            step={1}
            min="1"
            max="10"
            defaultValue={maxAdults}
          />
        </div>
      </fieldset>
      <fieldset className="goods-list">
        <h2 className="goods-list__title">Goods</h2>
        <ul className="goods-list__list">
          {GOODS.map((good) => (
            <li key={good} className="goods-list__item">
              <input
                type="checkbox"
                id={good}
                name={`${FormFieldName.good}${good}`}
                defaultChecked={chosenGoods.includes(good)}
              />
              <label className="goods-list__label" htmlFor={good}>
                {good}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <div className="form__input-wrapper location-picker">
        <label htmlFor="cityName" className="location-picker__label">
          Location
        </label>
        <Select
          className="location-picker__select"
          classNamePrefix="react-select"
          name={FormFieldName.cityName}
          id="cityName"
          defaultValue={{ value: city.name, label: city.name }}
          options={CITIES.map((cityItem) => ({
            value: cityItem,
            label: cityItem,
          }))}
          onChange={(evt) => {
            if (evt) {
              handleCityChange(evt.value);
            }
          }}
        />
      </div>
      <LocationPicker
        city={chosenCity}
        onChange={handleLocationChange}
        location={chosenLocation}
      />
      <button className="form__submit button" type="submit">
        Save
      </button>
    </form>
  );
};

export default OfferForm;
