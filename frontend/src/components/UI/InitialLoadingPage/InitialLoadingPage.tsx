import logo from '../../../assets/MyDataEaseLogo.png';

export default function InitialLoadingPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        margin: '0 auto',
      }}
    >
      <img src={logo} className="logo" alt="MyDataEase logo" />
    </div>
  );
}
